import AppConfig from '../config/app-config';

import _ from "lodash";

import CompanyHandler from '../handler/company.handler';

import TraderHandler from '../handler/trader.handler';

import TraderWalletHandler from '../handler/trader-wallet.handler';

import TraderPortfolioHandler from '../handler/trader-portfolio.handler';

import SystemWalletLedgerHandler from '../handler/system-wallet-ledger.handler';

import SystemPortfolioLedgerHandler from '../handler/system-portfolio-ledger.handler';

import TraderWalletLedgerHandler from '../handler/trader-wallet-ledger.handler';

import TraderPortfolioLedgerHandler from '../handler/trader-portfolio-ledger.handler';

import OfferControllor from '../controllers/offer.controller';

const sequelize = require('../models').postgres.sequelize;

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

        let amount = parseFloat( totalShares * unitPrice );
        
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

        /** 3. Deduct bkn from trader wallet **/
        let traderWallet = await TraderWalletHandler.deductCurrencyToTraderWallet(
            traderID,
            amount,
            transaction
        );

        /** 4. Update system wallet ledger **/
        let payload = {
            shareTrade: {
                totalShares: totalShares,
                unitPrice: unitPrice,
                amount: parseFloat( totalShares * unitPrice ),
                offerType: "BID",
                companyID: company.companyID,
                companyCode: company.companyCode
            },
            amount,
            from: traderID,
            to: "SYSTEM",
            transferType: "CREDIT",
            notes: "A BID offer is created by " + trader.getFullName + " . A total of " + amount + " BKN's at unit price of " + unitPrice + " BKN's are debited from Trader to System",
            privateNotes: "A BID offer is created by " + trader.getFullName + " ( "+ traderID +" ). A total of " + amount + " BKN's at unit price of " + unitPrice + " BKN's are debited from Trader to System"
        }
        let systemWalletLedger = await SystemWalletLedgerHandler.createNewSystemWalletLedger( payload, transaction );


        /** 5. Update trader wallet ledger **/
        payload.to = systemWalletLedger.systemWalletLedgerID;
        payload.transferType = "DEBIT";
        let traderWalletLedger = await TraderWalletLedgerHandler.createNewTraderWalletLedger( payload, transaction );

        /** 6. Update Offer and Broadcast **/
        payload.offerType = "BID";
        payload.systemLedgerID = systemWalletLedger.systemWalletLedgerID;
        payload.createdBy = traderID;
        payload.companyCode = company.companyCode;
        payload.companyID = company.companyID;
        let offer = await OfferControllor.createOffer( payload, transaction );

        return offer.offerID

    }

    createBidOffer = ( traderID, totalShares, unitPrice, companyCode ) => {

        let _self = this;

        return sequelize.transaction(function (t) {

            return _self._performCreateBidTransaction( traderID, parseInt( totalShares ), parseFloat( unitPrice ), companyCode , t);

        }).then( ( results ) => {
            //Inform notification service
            return {
                message: "BID offer created successfully",
                isError: false
            }
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
        /** 2. Check if Offer is of BID type **/
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
        if ( purchaser.traderID === seller.traderID && !AppConfig.canAcceptItsOwnBidOffer ) {
            throw new Error("You cannot accept your own bid offer");
        }

        /** 6. Deduct Shares from purchaser portfolio **/
        let purchaserPortfolio = await TraderPortfolioHandler.deductSharesFromTraderPortfolio(
            purchaser.traderID,
            company,
            systemWalletLedger.shareTrade.totalShares,
            transaction );
        
        
        /** 7. Update system portfolio ledger **/
        let payload = {
            shareTrade: {
                totalShares: systemWalletLedger.shareTrade.totalShares,
                unitPrice: systemWalletLedger.shareTrade.unitPrice,
                amount: systemWalletLedger.shareTrade.amount,
                offerType: "ACCEPT-BID",
                companyID: company.companyID,
                companyCode: company.companyCode
            },
            total: systemWalletLedger.shareTrade.totalShares,
            from: purchaser.traderID,
            to: "SYSTEM",
            transferType: "CREDIT",
            notes: "A SELL offer is accept by " + purchaser.getFullName + " . A total of " + systemWalletLedger.shareTrade.totalShares + " SHARES at unit price of " + systemWalletLedger.shareTrade.unitPrice + " BKN's are debited from Trader to System",
            privateNotes: "A SELL offer is accept by " + purchaser.getFullName + " ( "+ purchaser.traderID +" ). A total of " + systemWalletLedger.shareTrade.totalShares + " SHARES at unit price of " + systemWalletLedger.shareTrade.unitPrice + " BKN's are debited from Trader to System",
            companyID: company.companyID
        };
        let systemPortfolioLedgerP = await SystemPortfolioLedgerHandler.createSystemPortfolioLedger( payload, transaction );
        
        /** 8. Update purchaser portfolio ledger **/
        payload.transferType = "DEBIT";
        payload.to = systemPortfolioLedgerP.systemPortfolioLedgerID;
        let purchaserPortfolioLedgerP = await TraderPortfolioLedgerHandler.createTraderPortfolioLedger( payload, transaction );

        
        /** 9. Credit Shares to seller **/
        let sellerPortfolio = await TraderPortfolioHandler.addSharesToTraderPortfolio(
            seller.traderID,
            company,
            systemWalletLedger.shareTrade.totalShares,
            transaction
        );
        
        /** 10. Update system portfolio ledger **/
        let payload2 = {
            shareTrade: {
                totalShares: systemWalletLedger.shareTrade.totalShares,
                unitPrice: systemWalletLedger.shareTrade.unitPrice,
                amount: systemWalletLedger.shareTrade.amount,
                offerType: "ACCEPT-BID",
                companyID: company.companyID,
                companyCode: company.companyCode
            },
            total: systemWalletLedger.shareTrade.totalShares,
            to: seller.traderID,
            from: "SYSTEM",
            transferType: "DEBIT",
            notes: "Your BID offer was accepted. A total of " + systemWalletLedger.shareTrade.totalShares + " SHARES are credited from System to You",
            privateNotes: "BID offer created by " + seller.getFullName + " (  " + seller.traderID + "  ) is accepted by " + purchaser.getFullName + " ( "+ purchaser.traderID +" ). A total of " + systemWalletLedger.shareTrade.totalShares + " SHARES were transferred from System to Trader",
            companyID: company.companyID
        };
        let systemPortfolioLedgerS1 = await SystemPortfolioLedgerHandler.createSystemPortfolioLedger( payload2, transaction );
        
        
        /** 11. Update seller portfolio ledger **/
        payload2.from = systemPortfolioLedgerS1.systemPortfolioLedgerID;
        payload2.transferType = "CREDIT";
        let sellerPortfolioLedgerS1 = await TraderPortfolioLedgerHandler.createTraderPortfolioLedger( payload2, transaction );

        
        
        /** 12. Credit BKN's to purchaser **/
        let purchaserWallet = await TraderWalletHandler.addCurrencyToTraderWallet( purchaser.traderID, parseFloat( systemWalletLedger.shareTrade.amount ), transaction  );
        
        /** 13. Update system wallet ledger **/
        let payload3 = {
            shareTrade: {
                totalShares: systemWalletLedger.shareTrade.totalShares,
                unitPrice: systemWalletLedger.shareTrade.unitPrice,
                amount: systemWalletLedger.shareTrade.amount,
                offerType: "ACCEPT-BID",
                companyID: company.companyID,
                companyCode: company.companyCode
            },
            amount: systemWalletLedger.shareTrade.amount,
            to: purchaser.traderID,
            from: "SYSTEM",
            transferType: "DEBIT",
            notes: "A BID offer was accepted. A total of " + systemWalletLedger.shareTrade.amount + " BKN's are credited from System to You",
            privateNotes: "A BID offer created by " + seller.getFullName + " (  " + seller.traderID + "  ) is accepted by " + purchaser.getFullName + " ( "+ purchaser.traderID +" ). A total of " + systemWalletLedger.shareTrade.amount + " BKN's were transferred from System to Trader",
            companyID: company.companyID
        };
        let systemWalletLedgerP1 = await SystemWalletLedgerHandler.createNewSystemWalletLedger( payload3, transaction );


        /** 14. Update purchaser wallet ledger **/
        payload3.from = systemWalletLedgerP1.systemWalletLedgerID;
        payload3.transferType = "CREDIT";
        let purchaserWalletLedgerP1 = await TraderWalletLedgerHandler.createNewTraderWalletLedger( payload3, transaction );


        /** 15. Disable Offer and update consumedBy **/
        let offer2 = await OfferControllor.disableOffer( offerID, purchaser.traderID, transaction );
        
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
