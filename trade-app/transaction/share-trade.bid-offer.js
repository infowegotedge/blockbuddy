import AppConfig from '../config/app-config';

import CompanyHandler from '../handler/company.handler';

import TraderHandler from '../handler/trader.handler';

import OfferControllor from '../controllers/offer.controller';

import ShareTrade from './share-trade';

import CurrencyHandler from '../handler/currency.handler';

const sequelize = require('../models').postgres.sequelize;

const postgres = require('../models').postgres;

class TradeBidOffer {

    _performCreateBidTransaction =  async ( traderID, totalShares, unitPrice, companyCode, transaction ) => {

        /** Strategy
         * 1. Check if Trader can Trade
         * 2. Check if company is active
         * 3. Deduct BKN from trader wallet
         * 4. Update system wallet ledger
         * 5. Update trader wallet ledger
         * 6. Update Offer
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

        /** 3 / 4 / 5 Deduct bkn from trader wallet **/
        let bknPayload = await CurrencyHandler.getCurrencyInfoByCode( "BKN", transaction );
        let systemWalletLedgerID = await ShareTrade.deductCurrencyFromTraderWallet( trader, bknPayload, totalShares, unitPrice, "BUY-SHARE", transaction );
        
        
        
        /** 6. Update Offer and Broadcast **/
        let payload = {
            offerType: "BUY-SHARE",
            tradeUnitPrice: unitPrice,
            tradeTotalAmount: amount,
            tradeTotalShares: totalShares
        };
        payload.systemWalletLedgerID = systemWalletLedgerID;
        payload.createdBy = traderID;
        payload.companyCode = company.companyCode;
        payload.companyID = company.companyID;
        let offer = await OfferControllor.createOffer( payload, transaction );

        return offer.offerID;

    }

    createBidOffer = ( traderID, totalShares, unitPrice, companyCode ) => {

        let _self = this;

        return sequelize.transaction(function (t) {

            return _self._performCreateBidTransaction( traderID, parseInt( totalShares ), parseFloat( unitPrice ), companyCode , t);

        }).then( ( results ) => {
            //Inform notification service
            return { offerToken: results }

        }).catch( ( err ) => {
            throw err;
        });

    }
    
    
    _performAcceptBidTransaction =  async ( traderID, offerID, transaction ) => {

        /** Strategy
         * 1. Check if Offer is available or not
         * 2. Check if Offer is of BID type
         *
         * 3. Check if company is Active
         *
         * 4. Check if Purchaser & Seller can trade
         * 5. Check if Purchaser can buy his own offer
         *
         * 6. Deduct Shares from purchaser portfolio
         * 7. Update system portfolio ledger
         * 8. Update purchaser portfolio ledger
         *
         * 9. Credit Shares to seller
         * 10. Update system portfolio ledger
         * 11. Update seller portfolio ledger
         *
         * 12. Credit BKN's to purchaser
         * 13. Update system wallet ledger
         * 14. Update purchaser wallet ledger
         *
         * 15. Disable Offer and update consumedBy
         *
         * Insane Steps: But this is what is needed :-(
         */

        /** 1. Check if Offer is available or not **/
        /** 2. Check if Offer is of BUY-SHARE type **/
        let offer = await OfferControllor.getAvailableBidOfferByID( offerID, transaction );

        /** 3. Check if company is Active **/
        let company = offer.Company;
        if ( !company.isCompanyActive ) {
            throw new Error("Company is inactive");
        }
        
        let seller = offer.Trader;
        let systemWalletLedger = offer.SystemWalletLedger;

        /** 4. Check if Purchaser & Seller can trade **/
        let purchaser = await TraderHandler.getTraderInfo( traderID, transaction );
        if ( !purchaser.canTrade && !seller.canTrade ){
            throw new Error("Trader is not allowed to trade");
        }
        
        /** 5. Check if Purchaser can buy his own offer **/
        //if ( purchaser.traderID === seller.traderID && !AppConfig.canAcceptItsOwnBidOffer ) {
          //  throw new Error("You cannot accept your own bid offer");
       // }

        /** 6 / 7 / 8 Deduct Shares from purchaser portfolio **/
        let purchaserSystemPortfolioLedgerID = await ShareTrade.deductCompanySharesFromTraderAccount(
            purchaser,
            company,
            systemWalletLedger.shareTrade.total,
            systemWalletLedger.shareTrade.unitPrice,
            "ACCEPT-BUY-SHARE",
            transaction
        );
        

        
        /** 9 / 10 / 11 Credit Shares to seller **/
        let selletSystemPortfolioLedgerID = await ShareTrade.addCompanySharesToTraderAccount(
            seller,
            company,
            systemWalletLedger.shareTrade.total,
            systemWalletLedger.shareTrade.unitPrice,
            "ACCEPT-BUY-SHARE",
            transaction
        );

        let bknPayload = await CurrencyHandler.getCurrencyInfoByCode( "BKN", transaction );

        /** 12 / 13 / 14 Credit BKN's to purchaser **/
        let purchaserSystemWalletLedgerID = await ShareTrade.addCurrencyToTraderWallet(
            purchaser,
            bknPayload,
            systemWalletLedger.shareTrade.total,
            systemWalletLedger.shareTrade.unitPrice,
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
            unitPrice: systemWalletLedger.shareTrade.unitPrice,
            numberOfShares: systemWalletLedger.shareTrade.total
        }, transaction);
        
    }

    acceptBidOffer = ( traderID, offerID ) => {

        let _self = this;

        return sequelize.transaction(function (t) {

            return _self._performAcceptBidTransaction( traderID, offerID, t);

        }).then( ( results ) => {
            //Inform notification service
            return {
                message: "BID offer accepted successfully",
                isError: false
            }
        }).catch( ( err ) => {
            throw err;
        });

    }
}


export default new TradeBidOffer();
