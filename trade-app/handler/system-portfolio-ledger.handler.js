import AppConfig from '../config/app-config';

import randomstring from "randomstring";

import _ from "lodash";

const postgres = require('../models').postgres;

class SystemPortfolioLedgerHandler {
    
    createSystemPortfolioLedger = async ( payload, transaction = null ) => {

        let total = parseInt( payload.total );

        if ( !_.isFinite( total ) || total < 0 ){
            throw new Error( "Invalid Share total" );
        }

        let systemPortfolioLedger = await postgres.SystemPortfolioLedger.create({
            systemPortfolioLedgerID: AppConfig.systemPortfolioLedgerID + randomstring.generate(),
            shareTrade: payload.shareTrade,
            total: total,
            from: payload.from,
            to: payload.to,
            transferType: payload.transferType,
            type: payload.type,
            subType: payload.subType,
            companyID: payload.companyID,
            note: payload.note,
            privateNote: payload.privateNote
        },{transaction});

        return systemPortfolioLedger;
    
    }
    

    listSystemPortfolioLedger = async( page = 1, limit = AppConfig.defaultListSize, transaction = null ) => {

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

        return await postgres.SystemPortfolioLedger.findAndCount( query );

    }

}


export default new SystemPortfolioLedgerHandler();
