import _ from 'lodash';

import randomstring from "randomstring";

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

class SystemWalletLedgerHandler {

    createNewSystemWalletLedger = async ( payload,  transaction = null ) => {

        let amount = parseFloat( payload.amount );
        
        if ( !_.isFinite( amount ) || amount < 0 ){
            throw new Error( "Invalid Wallet amount" );
        }
        
        return await postgres.SystemWalletLedger.create({
            systemWalletLedgerID: AppConfig.systemWalletLedgerID + randomstring.generate(),
            shareTrade: payload.shareTrade,
            amount: payload.amount,
            from: payload.from,
            to: payload.to,
            currencyID: payload.currencyID,
            transferType: payload.transferType,
            type: payload.type,
            subType: payload.subType,
            note: payload.note,
            privateNote: payload.privateNote
        }, {transaction});

    }

    listAllSystemWalletLedger = async( page = 1, limit = AppConfig.defaultListSize, transaction = null ) => {

        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }

        let query = {
            offset,
            limit,
            order: [['updatedAt', 'DESC']],
            transaction
        };

        return await postgres.SystemWalletLedger.findAndCount( query );

    }

}


export default new SystemWalletLedgerHandler();
