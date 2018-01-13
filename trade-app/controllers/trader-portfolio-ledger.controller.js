import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

const uuidv4 = require('uuid/v4');

class TraderPortfolioLedgerController {
    
    createTraderPortfolioLedger = async ( payload, transaction = null ) => {

        let traderPortfolioLedger = await postgres.TraderPortfolioLedger.create({
            shareTrade: payload.shareTrade,
            total: payload.total,
            from: payload.from,
            to: payload.to,
            transferType: payload.transferType,
            notes: payload.notes,
            privateNotes: payload.privateNotes,
            companyID: payload.companyID
        }, { transaction });

        return traderPortfolioLedger;
    
    }

    listPortfolioLedgerOfAllTraders = async( page = 1,  limit = AppConfig.defaultListSize ) => {

        let offset = 0;

        if (page > 1) {
            offset = (page - 1) * limit;
        }
        
        return await postgres.TraderPortfolioLedger.findAll({offset, limit});

    }

    listTraderPortfolioLedger = async( traderID,  page = 1, limit = AppConfig.defaultListSize ) => {

        let offset = 0;

        if (page > 1) {
            offset = (page - 1) * limit;
        }

        return await postgres.TraderPortfolioLedger.findAll({
            where: {
                $or: [
                    { from: traderID },
                    { to: traderID }
                ]
            },
            offset,
            limit
        });

    }
    

    //====== Routes Action ========================================================

}


export default new TraderPortfolioLedgerController();
