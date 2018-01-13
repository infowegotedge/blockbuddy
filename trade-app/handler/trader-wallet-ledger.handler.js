import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

class TraderWalletLedgerHandler {

    createNewTraderWalletLedger = async ( payload, transaction = null ) => {

        let amount = parseFloat( payload.amount );

        if ( !_.isFinite( amount ) || amount < 0 ){
            throw new Error( "Invalid Wallet amount" );
        }
        
        return await postgres.TraderWalletLedger.create({
            traderWalletLedgerID: AppConfig.traderWalletLedgerID + randomstring.generate(),
            shareTrade: payload.shareTrade,
            amount: payload.amount,
            from: payload.from,
            to: payload.to,
            transferType: payload.transferType,
            type: payload.type,
            subType: payload.subType,
            currencyID: payload.currencyID,
            note: payload.note,
            privateNote: payload.privateNote
        },{transaction});
        
    }

    listWalletLedgerOfATrader = async( currencyCode = null, traderID,  page = 1, limit = AppConfig.defaultListSize, transaction = null ) => {

        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }

        let query = {
            where: {
                $or: [
                    { from: traderID },
                    { to: traderID }
                ]
            },
            offset,
            limit,
            order: [['updatedAt', 'DESC']],
            transaction
        };


        if ( currencyCode ) {

            let currency =  await postgres.Currency.findOne( {
                where:{
                    currencyCode
                },
                order: [['updatedAt', 'DESC']],
                transaction
            });

            if ( _.isNull( currency ) ) {

                throw new Error("Currency record not found");

            }

            query.where.currencyID = currency.currencyID;

        }
        

        return await postgres.TraderWalletLedger.findAndCount( query );
    }

}


export default new TraderWalletLedgerHandler();
