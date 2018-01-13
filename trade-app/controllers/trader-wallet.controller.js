import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

class TraderWalletController {

    getTraderWallet = async ( traderID, transaction = null ) => {

        return await postgres.TraderWallet.findOne({
            where: {
                traderID
            },
            transaction
        });
        
    }
    
    createTraderWallet = async ( traderID, amount, transaction = null ) => {

        amount = parseFloat( amount );

        if ( amount < 0 ) {
            throw new Error( "Wallet amount cannot be negative" );
        }
        
        return await postgres.TraderWallet.create(
            {
                traderWalletID: AppConfig.traderWalletID + randomstring.generate(),
                traderID,
                amount
            },
            {transaction}
        );
        
    }

    updateTraderWallet = async ( traderID, amount, transaction = null ) => {

        amount = parseFloat( amount );

        if ( amount < 0 ) {
            throw new Error( "Wallet amount cannot be negative" );
        }

        return await postgres.TraderWallet.update(
            {
                amount
            },
            {
                where: {
                    traderID
                },
                transaction
            }
        );

    }

    addBknsToTraderWallet = async ( traderID, amount, transaction = null  ) => {

        let traderWallet = await this.getTraderWallet( traderID, transaction );
        
        if ( _.isNull( traderWallet ) ) {

           return await this.createTraderWallet(traderID, amount, transaction);

        } 
        
        let totalBkns = parseFloat( traderWallet.amount ) + parseFloat( amount );
        
        return await this.updateTraderWallet( traderID, totalBkns, transaction );
        
    }

    deductBknsFromTraderWallet = async ( traderID, amount, transaction = null  ) => {

        let traderBknWallet = await postgres.TraderWallet.findOne({
            where: {
                traderID
            },
            transaction
        });

        if ( _.isEmpty(traderBknWallet.traderWalletID) ) {
            throw new Error("Trader wallet not found");
        }

        if ( amount > 0 ) {

            let totalBkns = parseFloat(traderBknWallet.amount) - amount;

            if ( totalBkns < 0 ) {
                throw new Error( "Bkn deduction amount too large. Can't continue" );
            }

            return await postgres.TraderWallet.update(
                {
                    amount: totalBkns
                },
                {
                    where: {
                        traderID
                    }
                }
            );

        } else {
            throw new Error( "Invalid wallet amount" );
        }

    }

}


export default new TraderWalletController();
