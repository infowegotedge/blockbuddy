import AppConfig from '../config/app-config';

import ProductSaleHandler from '../handler/product-sale.handler';

import TraderHandler from '../handler/trader.handler';

import ProductHandler from '../handler/product.handler';

import TraderQualificationHandler from '../handler/trader-qualification.handler'

import ProductSaleTraderWallet from './product-sale.trader-wallet';

import ProductSaleTraderPortfolio from './product-sale.trader-portfolio';

import CurrencyHandler from '../handler/currency.handler';

import QualificationHandler from '../handler/qualification.handler';

import CompanyHandler from '../handler/company.handler';

import _ from "lodash";

const sequelize = require('../models').postgres.sequelize;

class ProductSale {

    _updateProductSalesRecord =  async ( payload, productPayload, traderPayload, transaction ) => {

        if (
            _.isNull( payload.userName ) ||
            _.isNull( payload.sponsorUserName ) ||
            _.isNull( payload.productSku ) ||
            _.isNull( payload.orderTotal ) ||
            _.isNull( payload.orderID ) ||
            _.isNull( payload.gatewayResponse )
        ) {
            throw new Error("Parameters missing");
        }

        return await ProductSaleHandler.createNewProductSaleRecord({
            gatewayResponse: payload.gatewayResponse,
            note: "New Product Sales",
            orderTotal: payload.orderTotal,
            orderID: payload.orderID,
            productSku: productPayload.productSku,
            productID: productPayload.productID,
            traderID: traderPayload.traderID,
            sponsorUserName: payload.sponsorUserName,
            isProcessed: true
        }, transaction);

    }
    
    
    _processProductSaleAfterPGResponse =  async ( payload, transaction ) => {

        /** Strategy
         * # Read the availablibility of traderID, sponsorID, gateway response, product sku, orderTotal, orderID
         * # Get product object from SKU
         * # Check if product is Active
         * # Check if trader and sponsor can trade
         * # Get the object for traderID along with Qualification Level
         * # Get the object for sponsorID along with Qualification Level
         * # Verify the product sellingPrice is same as orderTotal
         * # Update admin ledger to show revenue of product sale in EURO
         * # Update Trader Portfolio based on Product Compensation
         * # Update Trader Wallet based on Product Compensation
         * # Update Sponsor BKN Wallet based on Product Total , Qualification Level
         * # Update traderID qualification level to "MARKETING-PARTNER"
         */

        if ( payload.userName == payload.sponsorUserName ) {
            throw new Error("Username and sponsorName can't be same");
        }

        var purchaser = await TraderHandler.getTraderInfoByUserName( payload.userName, transaction );

        var sponsor = await TraderHandler.getTraderInfoByUserName( payload.sponsorUserName, transaction );

        var product = await ProductHandler.getProductInfo( payload.productSku, transaction );
        
        if ( !product.isActive ) {
            throw new Error("Product has been disabled");
        }

        var productSale = await this._updateProductSalesRecord( payload, product, purchaser );

        let sponsorQualification = await TraderQualificationHandler.getTraderQualification( sponsor.traderID, transaction );

        let commission = 0;

        //@TODO remove in future : Its Hard coding here
        if ( sponsorQualification.qualificationCode == "FREE" ) {
            commission = 0.06 * parseFloat(product.sellingPrice);
        } else if ( sponsorQualification.qualificationCode == "MARKETING-PARTNER" ) {
            commission = 0.13 * parseFloat(product.sellingPrice);
        }

        //Allot BKNs to Direct sponsor
        let bknPayload = await CurrencyHandler.getCurrencyInfoByCode( "BKN", transaction );

        await ProductSaleTraderWallet._addCurrencyToTraderWalletOnProductSale( sponsor, bknPayload, commission, productSale.productSaleID, transaction );

        //Update purchaser level to "MARKETING-PARTNER"
        let purchaserQualification = await TraderQualificationHandler.getTraderQualification( purchaser.traderID, transaction );
        if ( purchaserQualification.qualificationCode == "FREE" ) {

            let marketingQualification = await QualificationHandler.getQualificationByCode( "MARKETING-PARTNER", transaction );

            let payload = {
                qualificationID: marketingQualification.qualificationID,
                qualificationCode: marketingQualification.qualificationCode,
                qualificationName: marketingQualification.qualificationName,
                traderID: purchaser.traderID
            };

            await TraderQualificationHandler.updateTraderQualification(payload, transaction);
        }

        //Based on Product Sold pass the benefits to purchaser
        if ( product.compensationWallet ) {

            for ( let i = 0; i <  product.compensationWallet.length; i++ ) {

                let wallet = product.compensationWallet[i];
                let currencyPayload = await CurrencyHandler.getCurrencyInfoByCode( wallet.currencyCode, transaction );

                await ProductSaleTraderWallet._addCurrencyToTraderWalletOnProductSale( purchaser, currencyPayload, wallet.total, productSale.productSaleID, transaction );
            }

        }

        if ( product.compensationPortfolio ) {

            for ( let i = 0; i <   product.compensationPortfolio.length; i++ ) {

                let portfolio = product.compensationPortfolio[i];

                let company = await CompanyHandler.getCompanyAllInfo( portfolio.companyCode, transaction );

                await ProductSaleTraderPortfolio._addSharesToTraderPortfolioOnProductSale( purchaser, company, portfolio.total, productSale.productSaleID, transaction );
            }

        }

    }
    

    processProductSaleAfterPGResponse = ( payload ) => {

        let _self = this;

        return sequelize.transaction(function (t) {

            return _self._processProductSaleAfterPGResponse( payload , t);

        }).then( ( results ) => {
            //Inform notification service
            return {
                message: "Commission distribution complete"
            }
        }).catch( ( err ) => {
            throw err;
        });

    }

}


export default new ProductSale();
