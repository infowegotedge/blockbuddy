import AppConfig from '../config/app-config';

import _ from "lodash";

import CompanyHandler from '../handler/company.handler';

import TraderHandler from '../handler/trader.handler';

import TraderPortfolioTransaction from './trader-portfolio';


import TraderPortfolioHandler from '../handler/trader-portfolio.handler';

import SystemWalletLedgerHandler from '../handler/system-wallet-ledger.handler';

import SystemPortfolioLedgerHandler from '../handler/system-portfolio-ledger.handler';

import TraderWalletLedgerHandler from '../handler/trader-wallet-ledger.handler';

import TraderPortfolioLedgerHandler from '../handler/trader-portfolio-ledger.handler';

import OfferControllor from '../controllers/offer.controller';


const sequelize = require('../models').postgres.sequelize;

class TradeSellOffer {

    _performCreateSellTransaction =  async ( traderID, totalShares, unitPrice, companyCode, transaction ) => {

        /** Strategy
         * 1. Check if Trader can Trade
         * 2. Check if company is active
         * 3. Deduct shares from trader portfolio
         * 4. Update system portfolio ledger
         * 5. Update trader portfolio ledger
         * 6. Update Offer
         */
        
        /** 1. Check if Trader can Trade **/
        let trader = await TraderHandler.getTraderInfo( traderID, transaction );
        if ( !trader.canTrade ) {
            throw new Error("Trader is not allowed to trader");
        }

        /** 2. Check if company is active **/
        let company = await CompanyHandler.getCompanyInfo( companyCode, transaction );
        if ( !company.isCompanyActive ) {
            throw new Error("Company is inactive");
        }
        
        /** 3. Deduct shares from trader portfolio **/
        let traderPortfolio = await TraderPortfolioHandler.deductSharesFromTraderPortfolio(
            traderID,
            company,
            totalShares,
            transaction
        );
        

        /** 4 & 5. Update system portfolio ledger **/
        let payload1 = {
            shareTrade: {
                totalShares: totalShares,
                unitPrice: unitPrice,
                amount: parseFloat( totalShares * unitPrice ),
                offerType: "SELL",
                companyID: company.companyID,
                companyCode: company.companyCode
            },
            total: totalShares,
            from: trader.traderID,
            to: "SYSTEM",
            transferType: "CREDIT",
            type: "SHARE-TRADING",
            subType: "SELL-SHARE",
            companyID: company.companyID,
            note:  "A SELL offer is created by " + trader.firstName + " " + trader.lastName + " . A total of " + totalShares + " SHARES at unit price of " + unitPrice + " BKN's are debited from Trader to System",
            privateNote: "A SELL offer is created by " + trader.firstName + " " + trader.lastName + " ( "+ traderID +" ). A total of " + totalShares + " SHARES at unit price of " + unitPrice + " BKN's are debited from Trader to System",
        };


        let systemPortfolioLedger = await SystemPortfolioLedgerHandler.createSystemPortfolioLedger( payload1, transaction );

        let payload2 = {
            traderID: trader.traderID,
            systemPortfolioLedgerID: systemPortfolioLedger.systemPortfolioLedgerID,
            total: totalShares,
            companyPayload: company,
            companyID: company.companyID,
            shareTrade: {
                totalShares: totalShares,
                unitPrice: unitPrice,
                amount: parseFloat( totalShares * unitPrice ),
                offerType: "SELL",
                companyID: company.companyID,
                companyCode: company.companyCode
            },
            transferType: "DEBIT",
            type: "SHARE-TRADING",
            subType: "SELL-SHARE",
            note:  "A SELL offer is created by " + trader.firstName + " " + trader.lastName + " . A total of " + totalShares + " SHARES at unit price of " + unitPrice + " BKN's are debited from Trader to System",
            privateNote: "A SELL offer is created by " + trader.firstName + " " + trader.lastName + " ( "+ traderID +" ). A total of " + totalShares + " SHARES at unit price of " + unitPrice + " BKN's are debited from Trader to System",
        };

        let traderportfolio = TraderPortfolioTransaction.updateTraderPortfolio( payload2, transaction );

        
        /** 6. Update Offer and Broadcast **/
        payload2.offerType = "SELL";
        payload2.systemPortfolioLedgerID = systemPortfolioLedger.systemPortfolioLedgerID;
        payload2.createdBy = traderID;
        payload2.companyCode = company.companyCode;
        payload2.companyID = company.companyID;
        let offer = await OfferControllor.createOffer( payload2, transaction );

        return offer.offerID;
        
    }

    createSellOffer = ( traderID, totalShares, unitPrice, companyCode ) => {

        let _self = this;

        return sequelize.transaction(function (t) {

            return _self._performCreateSellTransaction( traderID, parseInt( totalShares ), parseFloat( unitPrice ), companyCode , t);

        }).then( ( results ) => {
            //Inform notification service
            return {
                message: "Sell offer created successfully"
            }
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
        /** 2. Check if Offer is of BID type **/
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
        if ( purchaser.traderID === seller.traderID && !AppConfig.canAcceptItsOwnSellOffer ) {
            throw new Error("You cannot accept your own sell offer");
        }

        /** 6.  Deduct BKN's from purchaser wallet **/
        let purchaserWallet = await TraderWalletHandler.deductCurrencyToTraderWallet(
            purchaser.traderID,
            systemPortfolioLedger.shareTrade.amount,
            transaction
        );


        /** 7. Update system wallet ledger **/
        let payload = {
            shareTrade: {
                totalShares: systemPortfolioLedger.shareTrade.totalShares,
                unitPrice: systemPortfolioLedger.shareTrade.unitPrice,
                amount: systemPortfolioLedger.shareTrade.amount,
                offerType: "ACCEPT-SELL",
                companyID: company.companyID,
                companyCode: company.companyCode
            },
            amount: systemPortfolioLedger.shareTrade.amount,
            from: purchaser.traderID,
            to: "SYSTEM",
            transferType: "CREDIT",
            notes: "A SELL offer is accept by " + purchaser.getFullName + " . A total of " + systemPortfolioLedger.shareTrade.amount + " BKN's at unit price of " + systemPortfolioLedger.shareTrade.unitPrice + " per share is debited from Trader to System",
            privateNotes: "A SELL offer is accept by " + purchaser.getFullName + " ( "+ purchaser.traderID +" ). A total of " + systemPortfolioLedger.shareTrade.amount  + " BKN's at unit price of " + systemPortfolioLedger.shareTrade.unitPrice + " per share is debited from Trader to System",
            companyID: company.companyID
        };
        let systemWalletLedgerP = await SystemWalletLedgerHandler.createNewSystemWalletLedger( payload, transaction );

        /** 8. Update purchaser wallet ledger **/
        payload.transferType = "DEBIT";
        payload.to = systemWalletLedgerP.systemWalletLedgerID;
        let purchaserWalletLedger1 = await TraderPortfolioLedgerHandler.createTraderPortfolioLedger( payload, transaction );


        /** 9. Credit Shares to Purchaser **/
        let purchaserPortfolio = await TraderPortfolioHandler.addSharesToTraderPortfolio(
            purchaser.traderID,
            company.companyID,
            systemPortfolioLedger.shareTrade.totalShares,
            company.companyCode,
            company.companyName,
            transaction
        );

        /** 10. Update system portfolio ledger **/
        let payload2 = {
            shareTrade: {
                totalShares: systemPortfolioLedger.shareTrade.totalShares,
                unitPrice: systemPortfolioLedger.shareTrade.unitPrice,
                amount: systemPortfolioLedger.shareTrade.amount,
                offerType: "ACCEPT-SELL",
                companyID: company.companyID,
                companyCode: company.companyCode
            },
            total: systemPortfolioLedger.shareTrade.totalShares,
            to: purchaser.traderID,
            from: "SYSTEM",
            transferType: "DEBIT",
            notes: "A SELL offer was accepted. A total of " + systemPortfolioLedger.shareTrade.totalShares + " SHARES are credited from System to You",
            privateNotes: "A SELL offer created by " + seller.getFullName + " (  " + seller.traderID + "  ) is accepted by " + purchaser.getFullName + " ( "+ purchaser.traderID +" ). A total of " + systemPortfolioLedger.shareTrade.totalShares + " SHARES were transferred from System to Trader",
            companyID: company.companyID
        };
        let systemPortfolioLedgerP1 = await SystemPortfolioLedgerHandler.createSystemPortfolioLedger( payload2, transaction );


        /** 11. Update purchaser portfolio ledger **/
        payload2.from = systemPortfolioLedgerP1.systemPortfolioLedgerID;
        payload2.transferType = "CREDIT";
        let purchaserPortfolioLedgerP1 = await TraderPortfolioLedgerHandler.createTraderPortfolioLedger( payload2, transaction );



        /** 12. Credit BKN's to seller **/
        let sellerWallet = await TraderWalletHandler.addCurrencyToTraderWallet( seller.traderID, parseFloat( systemPortfolioLedger.shareTrade.amount ), transaction  );

        /** 13. Update system wallet ledger **/
        let payload3 = {
            shareTrade: {
                totalShares: systemPortfolioLedger.shareTrade.totalShares,
                unitPrice: systemPortfolioLedger.shareTrade.unitPrice,
                amount: systemPortfolioLedger.shareTrade.amount,
                offerType: "ACCEPT-SELL",
                companyID: company.companyID,
                companyCode: company.companyCode
            },
            amount: systemPortfolioLedger.shareTrade.amount,
            to: seller.traderID,
            from: "SYSTEM",
            transferType: "DEBIT",
            notes: "A BID offer was accepted. A total of " + systemPortfolioLedger.shareTrade.amount + " BKN's are credited from System to You",
            privateNotes: "A BID offer created by " + seller.getFullName + " (  " + seller.traderID + "  ) is accepted by " + purchaser.getFullName + " ( "+ purchaser.traderID +" ). A total of " + systemPortfolioLedger.shareTrade.amount + " BKN's were transferred from System to Trader",
            companyID: company.companyID
        };
        let systemWalletLedgerS1 = await SystemWalletLedgerHandler.createNewSystemWalletLedger( payload3, transaction );


        /** 14. Update seller wallet ledger **/
        payload3.from = systemWalletLedgerS1.systemWalletLedgerID;
        payload3.transferType = "CREDIT";
        let sellerWalletLedgerP1 = await TraderWalletLedgerHandler.createNewTraderWalletLedger( payload3, transaction );


        /** 15. Disable Offer and update consumedBy **/
        let offer2 = await OfferControllor.disableOffer( offerID, purchaser.traderID, transaction );

    }

    acceptSellOffer = ( traderID, offerID ) => {

        let _self = this;

        return sequelize.transaction(function (t) {

            return _self._performAcceptSellTransaction( traderID, offerID, t);

        }).then( ( results ) => {
            //Inform notification service
            return {
                message: "SELL offer accepted successfully",
            }
        }).catch( ( err ) => {
            throw err;
        });

    }

}


export default new TradeSellOffer();
