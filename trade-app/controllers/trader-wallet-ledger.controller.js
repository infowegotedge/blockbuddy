import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

const uuidv4 = require('uuid/v4');

class TraderWalletLedgerController {

    createTraderWalletLedger = async ( payload, transaction = null ) => {

        let traderWalletLedger = await postgres.TraderWalletLedger.create({
            shareTrade: payload.shareTrade,
            amount: payload.amount,
            from: payload.from,
            to: payload.to,
            transferType: payload.transferType,
            notes: payload.notes,
            privateNotes: payload.privateNotes
        },{transaction});

        return traderWalletLedger;

    }

    listWalletLedgerOfAllTraders = async( page = 1, limit = 25 ) => {

        let offset = 0;

        if (page > 1) {
            offset = (page - 1) * limit;
        }

        return await postgres.TraderWalletLedger.findAll({offset, limit});

    }

    listTraderWalletLedger = async( traderID,  page = 1, limit = AppConfig.defaultListSize ) => {

        let offset = 0;

        if (page > 1) {
            offset = (page - 1) * limit;
        }

        return await postgres.TraderWalletLedger.findAll({
            $or: [
                { from: traderID },
                { to: traderID }
            ],
            offset,
            limit
        });

    }


    //====== Routes Action ========================================================

}


export default new TraderWalletLedgerController();
