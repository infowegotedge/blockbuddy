import AppConfig from '../config/app-config';

import SystemPortfolioLedgerHandler from '../handler/system-portfolio-ledger.handler';

import TraderPortfolioLedgerHandler from '../handler/trader-portfolio-ledger.handler';

import TraderPortfolioHandler from '../handler/trader-portfolio.handler';

import SystemWalletLedgerHandler from '../handler/system-wallet-ledger.handler';

import TraderWalletLedgerHandler from '../handler/trader-wallet-ledger.handler';

import TraderWalletHandler from '../handler/trader-wallet.handler';

const sequelize = require('../models').postgres.sequelize;

class ShareTrade {


    // Portfolio -----------------------------
    recordCreditOfSharesInSystemLedger = async( traderObj, companyObj, total, unitPrice, offerType, transaction = null ) => {

        return await SystemPortfolioLedgerHandler.createSystemPortfolioLedger({
            shareTrade: {
              total,
              unitPrice,
              offerType,
              amount: parseFloat( unitPrice * total )
            },
            total,
            from: traderObj.traderID,
            to: "SYSTEM",
            companyID: companyObj.companyID,
            transferType: "CREDIT",
            type: "SHARE-TRADING",
            subType: offerType,
            note: "Allotment of " + total + " " + companyObj.companyCode + " coins from " + traderObj.firstName + " " + traderObj.lastName + " to SYSTEM on creating a " + offerType + " offer",
            privateNote: "Allotment of " + total + " " + companyObj.companyCode + " coins from " + traderObj.firstName + " " + traderObj.lastName + " ("+ traderObj.traderID +") to SYSTEM on creating a " + offerType + " offer",
        }, transaction );


    }

    recordDebitOfSharesInSystemLedger = async( traderObj, companyObj, total, unitPrice, offerType, transaction = null ) => {

        return await SystemPortfolioLedgerHandler.createSystemPortfolioLedger({
            shareTrade: {
              total,
              unitPrice,
              offerType,
              amount: parseFloat( unitPrice * total )
            },
            total,
            to: traderObj.traderID,
            from: "SYSTEM",
            companyID: companyObj.companyID,
            transferType: "DEBIT",
            type: "SHARE-TRADING",
            subType: offerType,
            note: "Deduction of " + total + " " + companyObj.companyCode + " coins from SYSTEM to " + traderObj.firstName + " " + traderObj.lastName + " on creating a " + offerType + " offer",
            privateNote: "Deduction of " + total + " " + companyObj.companyCode + " coins from SYSTEM to " + traderObj.firstName + " " + traderObj.lastName + " ("+ traderObj.traderID +") on creating a " + offerType + " offer",
        }, transaction );


    }

    recordDebitOfSharesInTraderLedger = async( systemPortfolioLedgerID, traderObj, companyObj, total, unitPrice, offerType, transaction = null ) => {

        return await TraderPortfolioLedgerHandler.createTraderPortfolioLedger({
            shareTrade: {
                total,
                unitPrice,
                offerType,
                amount: parseFloat( unitPrice * total )
            },
            total,
            from: traderObj.traderID,
            to: systemPortfolioLedgerID,
            companyID: companyObj.companyID,
            transferType: "DEBIT",
            type: "SHARE-TRADING",
            subType: offerType,
            //note: "Deduction of " + total + " " + companyObj.companyCode + " coins from " + traderObj.firstName + " " + traderObj.lastName + " to SYSTEM on creating a " + offerType + " offer",
            note: "Transferred " + companyObj.companyCode + " || to SYSTEM on creating a " + offerType + " offer",
            privateNote: "Deduction of " + total + " " + companyObj.companyCode + " coins from " + traderObj.firstName + " " + traderObj.lastName + " ("+ traderObj.traderID +") to SYSTEM on creating a " + offerType + " offer",
        }, transaction );

    }

    recordCreditOfSharesInTraderLedger = async( systemPortfolioLedgerID, traderObj, companyObj, total, unitPrice, offerType, transaction = null ) => {

        return await TraderPortfolioLedgerHandler.createTraderPortfolioLedger({
            shareTrade: {
                total,
                unitPrice,
                offerType,
                amount: parseFloat( unitPrice * total )
            },
            total,
            to: traderObj.traderID,
            from: systemPortfolioLedgerID,
            companyID: companyObj.companyID,
            transferType: "CREDIT",
            type: "SHARE-TRADING",
            subType: offerType,
            //note: "Allotment of " + total + " " + companyObj.companyCode + " coins from SYSTEM to " + traderObj.firstName + " " + traderObj.lastName + " on creating a " + offerType + " offer",
            note: "Received " + companyObj.companyCode + " || from SYSTEM on creating a " + offerType + " offer",
            privateNote: "Allotment of " + total + " " + companyObj.companyCode + " coins from SYSTEM to " + traderObj.firstName + " " + traderObj.lastName + " ("+ traderObj.traderID +") on creating a " + offerType + " offer",
        }, transaction );

    }

    deductCompanySharesFromTraderAccount = async( traderObj, companyObj, total, unitPrice, offerType, transaction = null ) => {

        //Record CREDIT in SystemPortfolio Ledger
        let systemPortfolioLedger = await this.recordCreditOfSharesInSystemLedger( traderObj, companyObj, total, unitPrice, offerType, transaction );
        
        //Record DEBIT in TraderPortfolio Ledger
        let traderPortfolioLedger = await this.recordDebitOfSharesInTraderLedger( systemPortfolioLedger.systemPortfolioLedgerID , traderObj, companyObj, total, unitPrice, offerType, transaction );
        
        //Deduct TraderPortfolio
        await TraderPortfolioHandler.deductSharesFromTraderPortfolio( traderObj.traderID, companyObj, total, transaction );
        
        return systemPortfolioLedger.systemPortfolioLedgerID;

    }

    addCompanySharesToTraderAccount = async( traderObj, companyObj, total, unitPrice, offerType, transaction = null ) => {

        //Record DEBIT in SystemPortfolio Ledger
        let systemPortfolioLedger = await this.recordDebitOfSharesInSystemLedger( traderObj, companyObj, total, unitPrice, offerType, transaction );

        //Record CREDIT in TraderPortfolio Ledger
        let traderPortfolioLedger = await this.recordCreditOfSharesInTraderLedger( systemPortfolioLedger.systemPortfolioLedgerID , traderObj, companyObj, total, unitPrice, offerType, transaction );

        //Add TraderPortfolio
        await TraderPortfolioHandler.addSharesToTraderPortfolio( traderObj.traderID, companyObj, total, transaction );
        
        return systemPortfolioLedger.systemPortfolioLedgerID;
    }



    // Wallet -----------------------------
    recordCreditOfWalletInSystemLedger = async( traderObj, currencyObj, total, unitPrice, offerType, transaction = null ) => {

        let amount = parseFloat( unitPrice ) * parseFloat(total );

        return await SystemWalletLedgerHandler.createNewSystemWalletLedger({
            shareTrade: {
                total,
                unitPrice,
                offerType,
                amount
            },
            amount,
            from: traderObj.traderID,
            to: "SYSTEM",
            currencyID: currencyObj.currencyID,
            transferType: "CREDIT",
            type: "SHARE-TRADING",
            subType: offerType,
            note: "Allotment of " + amount + " " + currencyObj.currencyCode + " from " + traderObj.firstName + " " + traderObj.lastName + " to SYSTEM on creating a " + offerType + " offer",
            privateNote: "Allotment of " + amount + " " + currencyObj.currencyCode + " from " + traderObj.firstName + " " + traderObj.lastName + " ("+ traderObj.traderID +") to SYSTEM on creating a " + offerType + " offer",
        }, transaction );

    }

    recordDebitOfWalletInSystemLedger = async( traderObj, currencyObj, total, unitPrice, offerType, transaction = null ) => {

        let amount = parseFloat( unitPrice ) * parseFloat(total );

        return await SystemWalletLedgerHandler.createNewSystemWalletLedger({
            shareTrade: {
                total,
                unitPrice,
                offerType,
                amount
            },
            amount,
            to: traderObj.traderID,
            from: "SYSTEM",
            currencyID: currencyObj.currencyID,
            transferType: "DEBIT",
            type: "SHARE-TRADING",
            subType: offerType,
            note: "Deduction of " + amount + " " + currencyObj.currencyCode + " from SYSTEM to " + traderObj.firstName + " " + traderObj.lastName + " on creating a " + offerType + " offer",
            privateNote: "Deduction of " + amount + " " + currencyObj.currencyCode + " from SYSTEM to " + traderObj.firstName + " " + traderObj.lastName + " ("+ traderObj.traderID +") on creating a " + offerType + " offer"
        }, transaction );

    }

    recordCreditOfWalletInTraderLedger = async( systemWalletLedgerID, traderObj, currencyObj, total, unitPrice, offerType, transaction = null ) => {

        let amount = parseFloat( unitPrice ) * parseFloat(total );

        return await TraderWalletLedgerHandler.createNewTraderWalletLedger({
            shareTrade: {
                total,
                unitPrice,
                offerType,
                amount
            },
            amount,
            to: traderObj.traderID,
            from: systemWalletLedgerID,
            currencyID: currencyObj.currencyID,
            transferType: "CREDIT",
            type: "SHARE-TRADING",
            subType: offerType,
            //note: "Allotment of " + amount + " " + currencyObj.currencyCode + " from SYSTEM to " + traderObj.firstName + " " + traderObj.lastName + " on creating a " + offerType + " offer",
            note: "Received " + currencyObj.currencyCode + " || from SYSTEM on creating a " + offerType + " offer",
            privateNote: "Allotment of " + amount + " " + currencyObj.currencyCode + " from SYSTEM to " + traderObj.firstName + " " + traderObj.lastName + " ("+ traderObj.traderID +") on creating a " + offerType + " offer"
        }, transaction );

    }

    recordDebitOfWalletInTraderLedger = async( systemWalletLedgerID, traderObj, currencyObj, total, unitPrice, offerType, transaction = null ) => {

        let amount = parseFloat( unitPrice ) * parseFloat(total );

        return await TraderWalletLedgerHandler.createNewTraderWalletLedger({
            shareTrade: {
                total,
                unitPrice,
                offerType,
                amount
            },
            amount,
            from: traderObj.traderID,
            to: systemWalletLedgerID,
            currencyID: currencyObj.currencyID,
            transferType: "DEBIT",
            type: "SHARE-TRADING",
            subType: offerType,
            //note: "Deduction of " + amount + " " + currencyObj.currencyCode + " from " + traderObj.firstName + " " + traderObj.lastName + " to SYSTEM on creating a " + offerType + " offer",
            note: "Transferred " + currencyObj.currencyCode + " || to SYSTEM on creating a " + offerType + " offer",
            privateNote: "Deduction of " + amount + " " + currencyObj.currencyCode + " from " + traderObj.firstName + " " + traderObj.lastName + " ("+ traderObj.traderID +") to SYSTEM on creating a " + offerType + " offer"
        }, transaction );

    }

    deductCurrencyFromTraderWallet = async( traderObj, currencyObj, total, unitPrice, offerType, transaction = null ) => {

        //Record CREDIT in SystemWallet Ledger
        let systemWalletLedger = await this.recordCreditOfWalletInSystemLedger( traderObj, currencyObj, total, unitPrice, offerType, transaction );

        //Record DEBIT in TraderWallet Ledger
        let traderPortfolioLedger = await this.recordDebitOfWalletInTraderLedger( systemWalletLedger.systemWalletLedgerID , traderObj, currencyObj, total, unitPrice, offerType, transaction );

        //Deduct TraderPortfolio
        let amount = parseFloat( unitPrice ) * parseFloat(total );
        await TraderWalletHandler.deductCurrencyToTraderWallet( traderObj.traderID, currencyObj, amount, transaction );

        return systemWalletLedger.systemWalletLedgerID;
    }

    addCurrencyToTraderWallet = async( traderObj, currencyObj, total, unitPrice, offerType, transaction = null ) => {

        //Record DEBIT in SystemWallet Ledger
        let systemWalletLedger = await this.recordDebitOfWalletInSystemLedger( traderObj, currencyObj, total, unitPrice, offerType, transaction );

        //Record DEBIT in TraderWallet Ledger
        let traderPortfolioLedger = await this.recordCreditOfWalletInTraderLedger( systemWalletLedger.systemWalletLedgerID , traderObj, currencyObj, total, unitPrice, offerType, transaction );

        //Deduct TraderPortfolio
        let amount = parseFloat( unitPrice ) * parseFloat(total );
        await TraderWalletHandler.addCurrencyToTraderWallet( traderObj.traderID, currencyObj, amount, transaction );

        return systemWalletLedger.systemWalletLedgerID;
    }

}


export default new ShareTrade();
