import SystemPortfolioLedgerHandler from '../handler/system-portfolio-ledger.handler';

import TraderPortfolioLedgerHandler from '../handler/trader-portfolio-ledger.handler';

import TraderPortfolioHandler from '../handler/trader-portfolio.handler';

const sequelize = require('../models').postgres.sequelize;

class CoinTransferTransaction {

    _addNewCreditEntryInSystemPortfolioLedger = async( traderObj, traderObjTo, companyObj, total, transaction = null ) => {

        return await SystemPortfolioLedgerHandler.createSystemPortfolioLedger({
            total,
            from: traderObj.traderID,
            to: "SYSTEM",
            companyID: companyObj.companyID,
            transferType: "CREDIT",
            type: "TRANSFER",
            subType: "COINS",
            note: "Manual Transfer of " + total + " " + companyObj.companyCode + " coins to " + traderObjTo.firstName + " " + traderObjTo.lastName,
            privateNote: "Manual Transfer of " + total + " " + companyObj.companyCode + " coins from " + traderObj.traderID +" to " + traderObjTo.traderID
        }, transaction );

    }


    _addNewDebitEntryInSystemPortfolioLedger = async( traderObj, traderObjFrom, companyObj, total, transaction = null ) => {

        return await SystemPortfolioLedgerHandler.createSystemPortfolioLedger({
            total,
            to: traderObj.traderID,
            from: "SYSTEM",
            companyID: companyObj.companyID,
            transferType: "DEBIT",
            type: "TRANSFER",
            subType: "COINS",
            note: "Manual Transfer of " + total + " " + companyObj.companyCode + " coins from " + traderObjFrom.firstName + " " + traderObjFrom.lastName,
            privateNote: "Manual Transfer of " + total + " " + companyObj.companyCode + " coins from " + traderObjFrom.traderID +" to " + traderObj.traderID
        }, transaction );

    }


    _addNewCreditEntryInTraderPortfolioLedger = async( systemPortfolioLedgerID, traderObj, traderObjFrom, companyObj, total, transaction = null ) => {

        return await TraderPortfolioLedgerHandler.createTraderPortfolioLedger({
            total,
            to: traderObj.traderID,
            from: systemPortfolioLedgerID,
            companyID: companyObj.companyID,
            transferType: "CREDIT",
            type: "TRANSFER",
            subType: "COINS",
            //note: "Manual Transfer of " + total + " " + companyObj.companyCode + " coins from " + traderObjFrom.firstName + " " + traderObjFrom.lastName,
            note: "Transferred "+ companyObj.companyCode + " || from " + traderObjFrom.firstName + " " + traderObjFrom.lastName,
            privateNote: "Manual Transfer of " + total + " " + companyObj.companyCode + " coins from " + traderObjFrom.traderID +" to " + traderObj.traderID
        }, transaction );

    }


    _addNewDebitEntryInTraderPortfolioLedger = async( systemPortfolioLedgerID, traderObj, traderObjTo, companyObj, total, transaction = null ) => {

        return await TraderPortfolioLedgerHandler.createTraderPortfolioLedger({
            total,
            from: traderObj.traderID,
            to: systemPortfolioLedgerID,
            companyID: companyObj.companyID,
            transferType: "DEBIT",
            type: "TRANSFER",
            subType: "COINS",
            //note: "Manual Transfer of " + total + " " + companyObj.companyCode + " coins to " + traderObjTo.firstName + " " + traderObjTo.lastName,
            note: "Transferred "+ companyObj.companyCode + " || to " + traderObjTo.firstName + " " + traderObjTo.lastName,
            privateNote: "Manual Transfer of " + total + " " + companyObj.companyCode + " coins from " + traderObj.traderID +" to " + traderObjTo.traderID
        }, transaction );

    }

    
    _addAndUpdateTraderPortfolio =  async( traderObj, companyObj, total, transaction = null ) => {
        
        await TraderPortfolioHandler.addSharesToTraderPortfolio( traderObj.traderID, companyObj, total, transaction );
        
        return true;

    }

    _deductAndUpdateTraderPortfolio =  async( traderObj, companyObj, total, transaction = null ) => {

        await TraderPortfolioHandler.deductSharesFromTraderPortfolio( traderObj.traderID, companyObj, total, transaction );

        return true;

    }

    _transferCoins = async(  fromTraderObj, toTraderObj, companyObj, total, transaction = null ) => {

        //Create a CREDIT type entry in systemPortfolioLedger
        let systemPortfolioLedgerFrom = await this._addNewCreditEntryInSystemPortfolioLedger( fromTraderObj, toTraderObj, companyObj, total, transaction );

        //Create a DEBIT type entry in fromTraderPortfolio
        let traderPortfolioLedgerIDFrom = await this._addNewDebitEntryInTraderPortfolioLedger( systemPortfolioLedgerFrom.systemPortfolioLedgerID, fromTraderObj, toTraderObj, companyObj, total, transaction );

        //DEDUCT & Update fromTraderPortfolio
        await this._deductAndUpdateTraderPortfolio( fromTraderObj, companyObj, total, transaction );
        
        //Create a DEBIT type entry in systemPortfolioLedger
        let systemPortfolioLedgerTo = await this._addNewDebitEntryInSystemPortfolioLedger( toTraderObj, fromTraderObj, companyObj, total, transaction );

        //Create a CREDIT type entry in toTraderPortfolio
        let traderPortfolioLedgerIDTo = await this._addNewCreditEntryInTraderPortfolioLedger( systemPortfolioLedgerTo.systemPortfolioLedgerID, toTraderObj, fromTraderObj, companyObj, total, transaction );
        
        //Add & Update toTraderPortfolio
        return await this._addAndUpdateTraderPortfolio( toTraderObj, companyObj, total, transaction )
        
    }
    
    /**
     * Adds Amount based on a particular currency to trader's Portfolio
     * @param traderObj
     * @param companyObj
     * @param total
     * @param productSaleID
     * @returns {Promise.<T>}
     */
    transferCoins = ( fromTraderObj, toTraderObj, companyObj, total ) => {
        
        let _self = this;
        
        return sequelize.transaction(function (t) {
            
            return _self._transferCoins( fromTraderObj, toTraderObj, companyObj, total, t );
            
        }).then( ( results ) => {
            
            return true;
            
        }).catch( ( err ) => {
            throw err;
        });
    }




    
    
}


export default new CoinTransferTransaction();
