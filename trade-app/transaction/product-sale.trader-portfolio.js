import SystemPortfolioLedgerHandler from '../handler/system-portfolio-ledger.handler';

import TraderPortfolioLedgerHandler from '../handler/trader-portfolio-ledger.handler';

import TraderPortfolioHandler from '../handler/trader-portfolio.handler';

const sequelize = require('../models').postgres.sequelize;

class ProductSaleTraderPortfolio {
    
    _addNewDebitEntryOnProductPurchaseInSystemPortfolioLedger = async( traderObj, companyObj, total, productSaleID, transaction = null ) => {

        return await SystemPortfolioLedgerHandler.createSystemPortfolioLedger({
            total,
            to: traderObj.traderID,
            from: "SYSTEM",
            companyID: companyObj.companyID,
            transferType: "DEBIT",
            type: "PRODUCT",
            subType: "PURCHASE",
            note: "Allotment of " + total + " " + companyObj.companyCode + " coins to " + traderObj.firstName + " " + traderObj.lastName + " on product purchase",
            privateNote: "Allotment of " + total + " " + companyObj.companyCode + " coins to " + traderObj.firstName + " " + traderObj.lastName + " ("+ traderObj.traderID +") on product purchase [" + productSaleID + "]"
        }, transaction );

    }

    _addNewCreditEntryOnProductPurchaseInTraderPortfolioLedger = async( systemPortfolioLedgerID, traderObj, companyObj, total, productSaleID, transaction = null ) => {

        return await TraderPortfolioLedgerHandler.createTraderPortfolioLedger({
            total,
            to: traderObj.traderID,
            from: systemPortfolioLedgerID,
            companyID: companyObj.companyID,
            transferType: "CREDIT",
            type: "PRODUCT",
            subType: "PURCHASE",
            //note: "Allotment of " + total + " " + companyObj.companyCode + " coins to " + traderObj.firstName + " " + traderObj.lastName + " on product purchase",
            note: "Received " + companyObj.companyCode + " || on product purchase #" + productSaleID,
            privateNote: "Allotment of " + total + " " + companyObj.companyCode + " coins to " + traderObj.firstName + " " + traderObj.lastName + " ("+ traderObj.traderID +") on product purchase [" + productSaleID + "]"
        }, transaction );

    }
    
    _addAndUpdateTraderPortfolioOnProductPurchase =  async( traderObj, companyObj, total, transaction = null ) => {
        
        await TraderPortfolioHandler.addSharesToTraderPortfolio( traderObj.traderID, companyObj, total, transaction );
        
        return true;

    }

    _addSharesToTraderPortfolioOnProductSale = async( traderObj, companyObj, total, productSaleID, transaction = null ) => {
        
        //Create a DEBIT type entry in systemPortfolioLedger
        let systemPortfolioLedger = await this._addNewDebitEntryOnProductPurchaseInSystemPortfolioLedger( traderObj, companyObj, total, productSaleID, transaction );

        //Create a CREDIT type entry in traderPortfolio
        let traderPortfolioLedgerID = await this._addNewCreditEntryOnProductPurchaseInTraderPortfolioLedger( systemPortfolioLedger.systemPortfolioLedgerID, traderObj, companyObj, total, productSaleID, transaction );
        
        //Add & Update trader Portfolio
        return await this._addAndUpdateTraderPortfolioOnProductPurchase( traderObj, companyObj, total, transaction )
        
    }
    
    /**
     * Adds Amount based on a particular currency to trader's Portfolio
     * @param traderObj
     * @param companyObj
     * @param total
     * @param productSaleID
     * @returns {Promise.<T>}
     */
    addSharesToTraderPortfolioOnProductSale = ( traderObj, companyObj, total, productSaleID ) => {
        
        let _self = this;
        
        return sequelize.transaction(function (t) {
            
            return _self._addSharesToTraderPortfolioOnProductSale( traderObj, companyObj, total, productSaleID, t );
            
        }).then( ( results ) => {
            
            return true;
            
        }).catch( ( err ) => {
            throw err;
        });
    }
    
    
}


export default new ProductSaleTraderPortfolio();
