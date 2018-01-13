import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

class TraderPortfolioLedgerHandler {
    
    createTraderPortfolioLedger = async ( payload, transaction = null ) => {

        let total = parseInt( payload.total );
        
        if ( !_.isFinite( total ) || total < 0 ){
            throw new Error( "Invalid Share total" );
        }

        let traderPortfolioLedger = await postgres.TraderPortfolioLedger.create({
            traderPortfolioLedgerID: AppConfig.traderPortfolioLedgerID + randomstring.generate(),
            shareTrade: payload.shareTrade,
            total: total,
            from: payload.from,
            to: payload.to,
            transferType: payload.transferType,
            type: payload.type,
            subType: payload.subType,
            note: payload.note,
            privateNote: payload.privateNote,
            companyID: payload.companyID
        }, { transaction });

        return traderPortfolioLedger;
    
    }

    listPortfolioLedgerOfATrader = async( companyCode = null, traderID, page = 1,  limit = AppConfig.defaultListSize,  transaction = null ) => {

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

        if ( companyCode ) {
            let company = await postgres.Company.findOne( { where: {companyCode}, transaction , order: [['updatedAt', 'DESC']]} );

            if (_.isNull(company) ) {
                throw new Error("Company not found");
            }
            
            query.where.companyID = company.companyID;

        }

        return await postgres.TraderPortfolioLedger.findAndCount( query );

    }

}


export default new TraderPortfolioLedgerHandler();
