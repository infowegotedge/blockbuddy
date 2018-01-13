import AppConfig from '../config/app-config';

import CompanyHandler from '../handler/company.handler';

import TraderHandler from '../handler/trader.handler';

import OfferControllor from '../controllers/offer.controller';

import ShareTrade from './share-trade';

import CurrencyHandler from '../handler/currency.handler';

const sequelize = require('../models').postgres.sequelize;

const postgres = require('../models').postgres;

class TradeSellOffer {

    _performCreateSellTransaction =  async ( traderID, totalShares, unitPrice, companyCode, transaction ) => {

        /** Strategy
         * 1. Check if Trader can Trade
         * 2. Check if company is active
         * 3. Deduct shares from trader portfolio
         * 4. Update Offer
         */

        //@TODO Needs to be removed in future
        if ( companyCode == "SITV-WARRANT" || companyCode == "REALXIQ-AB" || companyCode == "STOCKHOLM-IT-AB"  || companyCode == "YAZZER-LIFESTYLE-AB" || companyCode == "BLOCK-EVOLUTION-NV"  ) {
            throw new Error("Trading with " + companyCode + " is temporarily disabled");
        }



        let amount = parseFloat( totalShares ) *  parseFloat( unitPrice );
        
        /** 1. Check if Trader can Trade **/
        let trader = await TraderHandler.getTraderInfo( traderID, transaction );
        if ( !trader.canTrade ) {
            throw new Error("Trader is not allowed to trade");
        }

        /** 2. Check if company is active **/
        let company = await CompanyHandler.getCompanyInfo( companyCode, transaction );
        if ( !company.isCompanyActive ) {
            throw new Error("Company is inactive");
        }

        /** 3. Deduct shares from trader portfolio **/
        let systemPortfolioLedgerID = await ShareTrade.deductCompanySharesFromTraderAccount(
            trader,
            company,
            totalShares,
            unitPrice,
            "SELL-SHARE",
            transaction
        );

        /** 4. Update Offer and Broadcast **/
        let payload = {
            offerType: "SELL-SHARE",
            tradeUnitPrice: unitPrice,
            tradeTotalAmount: amount,
            tradeTotalShares: totalShares
        };
        payload.systemPortfolioLedgerID = systemPortfolioLedgerID;
        payload.createdBy = traderID;
        payload.companyCode = company.companyCode;
        payload.companyID = company.companyID;
        let offer = await OfferControllor.createOffer( payload, transaction );

        return offer.offerID;

    }

    createSellOffer = ( traderID, totalShares, unitPrice, companyCode ) => {

        let _self = this;

        return sequelize.transaction(function (t) {

            return _self._performCreateSellTransaction( traderID, parseInt( totalShares ), parseFloat( unitPrice ), companyCode , t);

        }).then( ( results ) => {
            //Inform notification service
            return { offerToken: results }

        }).catch( ( err ) => {
            throw err;
        });

    }
    
    
    _performAcceptSellTransaction =  async ( traderID, offerID, transaction ) => {

        /** Strategy
         * 1. Check if Offer is available or not
         * 2. Check if Offer is of BID type
         *
         * 3. Check if company is Active
         *
         * 4. Check if Purchaser & Seller can trade
         * 5. Check if Purchaser can buy his own offer
         *
         * 6. Deduct BKN's from purchaser wallet
         * 7. Update system wallet ledger
         * 8. Update purchaser wallet ledger
         *
         * 9. Credit Shares to Purchaser
         * 10. Update system portfolio ledger
         * 11. Update purchaser portfolio ledger
         *
         * 12. Credit BKN's to seller
         * 13. Update system wallet ledger
         * 14. Update seller wallet ledger
         *
         * 15. Disable Offer and update consumedBy
         *
         * Insane Steps: But this is what is needed :-(
         */

        /** 1. Check if Offer is available or not **/
        /** 2. Check if Offer is of SELL-SHARE type **/
        let offer = await OfferControllor.getAvailableSellOfferByID( offerID, transaction );

        /** 3. Check if company is Active **/
        let company = offer.Company;
        if ( !company.isCompanyActive ) {
            throw new Error("Company is inactive");
        }
        
        let seller = offer.Trader;
        let systemPortfolioLedger = offer.SystemPortfolioLedger;
        

        /** 4. Check if Purchaser & Seller can trade **/
        let purchaser = await TraderHandler.getTraderInfo( traderID, transaction );
        if ( !purchaser.canTrade && !seller.canTrade ){
            throw new Error("Trader is not allowed to trade");
        }

        /** 5. Check if Purchaser can buy his own offer **/
        //if ( purchaser.traderID === seller.traderID && !AppConfig.canAcceptItsOwnSellOffer ) {
        //    throw new Error("You cannot accept your own sell offer");
        //}

        /** 6 / 7 / 8 Deduct Bkn from purchaser portfolio **/
        let bknPayload = await CurrencyHandler.getCurrencyInfoByCode( "BKN", transaction );

        let purchaserSystemWalletLedgerID = await ShareTrade.deductCurrencyFromTraderWallet(
            purchaser,
            bknPayload,
            systemPortfolioLedger.shareTrade.total,
            systemPortfolioLedger.shareTrade.unitPrice,
            "ACCEPT-SELL-SHARE",
            transaction
        );

        
        /** 9 / 10 / 11 Credit Shares to Purchaser  **/
        let purchaserSystemPortfolioLedgerID = await ShareTrade.addCompanySharesToTraderAccount(
            purchaser,
            company,
            systemPortfolioLedger.shareTrade.total,
            systemPortfolioLedger.shareTrade.unitPrice,
            "ACCEPT-BUY-SHARE",
            transaction
        );


        /** 12 / 13 / 14 Credit BKN's to seller **/
        let sellerSystemWalletLedgerID = await ShareTrade.addCurrencyToTraderWallet(
            seller,
            bknPayload,
            systemPortfolioLedger.shareTrade.total,
            systemPortfolioLedger.shareTrade.unitPrice,
            "ACCEPT-BUY-SHARE",
            transaction
        );


        /** 15. Disable Offer and update consumedBy **/
        let offer2 = await OfferControllor.disableOffer( offerID, purchaser.traderID, transaction );

        /** 16. Update Exchange Log **/
        let exchangeLog = await postgres.ExchangeLog.createLog({
            offerID,
            companyID: company.companyID,
            companyCode: company.companyCode,
            companyName: company.companyName,
            unitPrice: systemPortfolioLedger.shareTrade.unitPrice,
            numberOfShares: systemPortfolioLedger.shareTrade.total
        }, transaction);

    }

    acceptSellOffer = ( traderID, offerID ) => {

        let _self = this;

        return sequelize.transaction(function (t) {

            return _self._performAcceptSellTransaction( traderID, offerID, t);

        }).then( ( results ) => {
            //Inform notification service
            return {
                message: "Sell offer accepted successfully"
            }
        }).catch( ( err ) => {
            throw err;
        });

    }
}


export default new TradeSellOffer();
