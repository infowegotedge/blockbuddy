import SystemWalletLedgerHandler from '../handler/system-wallet-ledger.handler';

import TraderWalletLedgerHandler from '../handler/trader-wallet-ledger.handler';

import TraderWalletHandler from '../handler/trader-wallet.handler';

const sequelize = require('../models').postgres.sequelize;

class ProductSaleTraderWallet {
    
    _addNewDebitEntryOnProductPurchaseInSystemWalletLedger = async( traderObj, currencyObj, amount, productSaleID, transaction = null ) => {

        return await SystemWalletLedgerHandler.createNewSystemWalletLedger({
            amount,
            to: traderObj.traderID,
            from: "SYSTEM",
            currencyID: currencyObj.currencyID,
            transferType: "DEBIT",
            type: "PRODUCT",
            subType: "PURCHASE",
            note: "Allotment of " + amount + " " + currencyObj.currencyCode + " to " + traderObj.firstName + " " + traderObj.lastName + " on product purchase",
            privateNote: "Allotment of " + amount + " " + currencyObj.currencyCode + " to " + traderObj.firstName + " " + traderObj.lastName + " ("+ traderObj.traderID +") on product purchase [ " + productSaleID + " ]"
        }, transaction );

    }

    _addNewCreditEntryOnProductPurchaseInTraderWalletLedger = async( systemWalletLedgerID, traderObj, currencyObj, amount, productSaleID, transaction = null ) => {

        return await TraderWalletLedgerHandler.createNewTraderWalletLedger({
            amount,
            to: traderObj.traderID,
            from: systemWalletLedgerID,
            currencyID: currencyObj.currencyID,
            transferType: "CREDIT",
            type: "PRODUCT",
            subType: "PURCHASE",
            //note: "Allotment of " + amount + " " + currencyObj.currencyCode + " to " + traderObj.firstName + " " + traderObj.lastName + " on product purchase",
            note: "Received " + currencyObj.currencyCode + " || on product purchase #" + productSaleID,
            privateNote: "Allotment of " + amount + " " + currencyObj.currencyCode + " to " + traderObj.firstName + " " + traderObj.lastName + " ("+ traderObj.traderID +") on product purchase [ " + productSaleID + " ]"
        }, transaction );

    }
    
    _addAndUpdateTraderWalletOnProductPurchase =  async( traderObj, currencyObj, amount, transaction = null ) => {

        await TraderWalletHandler.addCurrencyToTraderWallet( traderObj.traderID, currencyObj, amount, transaction );
        
        return true;

    }
    
    _addCurrencyToTraderWalletOnProductSale = async( traderObj, currencyObj, amount, productSaleID, transaction = null ) => {
        
        //Create a DEBIT type entry in systemWalletLedger
        let systemWalletLedger = await this._addNewDebitEntryOnProductPurchaseInSystemWalletLedger( traderObj, currencyObj, amount, productSaleID, transaction );

        //Create a CREDIT type entry in traderWallet
        let traderWalletLedger = await this._addNewCreditEntryOnProductPurchaseInTraderWalletLedger( systemWalletLedger.systemWalletLedgerID, traderObj, currencyObj, amount, productSaleID, transaction );

        //Add & Update trader wallet
        return this._addAndUpdateTraderWalletOnProductPurchase( traderObj, currencyObj, amount, transaction  );
        
    }
    
    /**
     * Adds Amount based on a particular currency to trader's wallet
     * @param traderObj
     * @param currencyObj
     * @param amount
     * @param productSaleID
     * @returns {Promise.<T>}
     */
    addCurrencyToTraderWalletOnProductSale = ( traderObj, currencyObj, amount, productSaleID ) => {
        
        let _self = this;
        
        return sequelize.transaction(function (t) {
            
            return _self._addCurrencyToTraderWalletOnProductSale( traderObj, currencyObj, amount, productSaleID, t );
            
        }).then( ( results ) => {
            
            return true;
            
        }).catch( ( err ) => {
            throw err;
        });
    }
    
    
}


export default new ProductSaleTraderWallet();
