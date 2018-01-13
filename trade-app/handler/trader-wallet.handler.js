import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

class TraderWalletHandler {

    getTraderWallet = async ( traderID, transaction = null ) => {

        let trader = await postgres.TraderWallet.findAll({
            where: {
                traderID
            },
            order: [['updatedAt', 'DESC']],
            transaction
        });

        if ( _.isNull( trader ) ) {

            throw new Error( "Record not found" );

        }

        return trader
        
    }

    getTraderWalletByCurrencyID = async ( traderID, currencyID,  transaction = null ) => {
        
        let trader = await postgres.TraderWallet.findOne({
            where: {
                traderID,
                currencyID
            },
            order: [['updatedAt', 'DESC']],
            transaction
        });

        if ( _.isNull( trader ) ) {

            throw new Error( "Record not found" );

        }
        return trader;

    }

    createNewTraderWallet = async ( traderID, currencyPayload, amount, transaction = null ) => {

        amount = parseFloat( amount );

        if ( amount < 0 ) {
            throw new Error( "Wallet amount cannot be negative" );
        }

        if ( !_.isFinite(amount) ){
            throw new Error( "Invalid Wallet amount" );
        }
        
        return await postgres.TraderWallet.create(
            {
                traderWalletID: AppConfig.traderWalletID + randomstring.generate(),
                traderID,
                currencyID: currencyPayload.currencyID,
                currencyCode: currencyPayload.currencyCode,
                currencyName: currencyPayload.currencyName,
                amount
            },
            {transaction}
        );
        
    }

    updateTraderWallet = async ( traderID, currencyID, amount, transaction = null ) => {

        amount = parseFloat( amount );

        if ( amount < 0 ) {
            throw new Error( "Wallet amount cannot be negative" );
        }

        if ( !_.isFinite(amount) ){
            throw new Error( "Invalid Wallet amount" );
        }

        return await postgres.TraderWallet.update(
            {
                amount
            },
            {
                where: {
                    traderID,
                    currencyID
                },
                transaction
            }
        );

    }

    addCurrencyToTraderWallet = async ( traderID, currencyPayload, amount, transaction = null  ) => {

        let traderWallet;

        try { 

            traderWallet = await this.getTraderWalletByCurrencyID( traderID, currencyPayload.currencyID, transaction );
            
            let totalAmount = parseFloat( traderWallet.amount ) + parseFloat( amount );
            
            return await this.updateTraderWallet( traderID,  currencyPayload.currencyID, totalAmount, transaction );

        } catch ( err ) {

            return await this.createNewTraderWallet(traderID, currencyPayload, amount, transaction);

        }
        
    }

    deductCurrencyToTraderWallet = async ( traderID, currencyPayload, amount, transaction = null  ) => {

        let traderWallet = await this.getTraderWalletByCurrencyID( traderID, currencyPayload.currencyID, transaction );

        let totalAmount = parseFloat( traderWallet.amount ) - parseFloat( amount );

        return await this.updateTraderWallet( traderID,  currencyPayload.currencyID, totalAmount, transaction );
    }

}


export default new TraderWalletHandler();
