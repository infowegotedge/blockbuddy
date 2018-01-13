import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

class TraderPortfolioHandler {

    getTraderPortfolioOfACompany = async ( traderID, companyID, transaction = null ) => {
        return await postgres.TraderPortfolio.findOne({
            where: {
                traderID,
                companyID
            },
            order: [['updatedAt', 'DESC']],
            transaction
        });
    }
    
    createTraderPortfolio = async ( traderID, companyPayload, totalShares, transaction = null ) => {

        totalShares = parseInt( totalShares );
        
        if ( totalShares < 0 ) {
            throw new Error( "Total Shares cannot be negative" );
        }

        if ( !_.isFinite(totalShares) ){
            throw new Error( "Invalid Share total" );
        }

        return await postgres.TraderPortfolio.create(
            {
                traderPortfolioID: AppConfig.traderPortfolioID + randomstring.generate(),
                traderID,
                companyCode: companyPayload.companyCode,
                companyName: companyPayload.companyName,
                companyID: companyPayload.companyID,
                totalShares
            },
            {transaction}
        );
        
    }

    updateTraderPortfolio = async( traderID, companyID, totalShares, transaction = null ) => {

        totalShares = parseInt( totalShares );

        if ( totalShares < 0 ) {
            throw new Error( "Total Shares cannot be negative" );
        }

        if ( !_.isFinite(totalShares) ){
            throw new Error( "Invalid Share total" );
        }
        
        return await postgres.TraderPortfolio.update(
            {
                totalShares
            },
            {
                where: {
                    traderID,
                    companyID
                },
                transaction
            }
        );
        
    }

    getTraderPortfolio = async ( traderID, page = 1, limit = AppConfig.defaultListSize, transaction = null ) => {

        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }
        
        let traderShare = await postgres.TraderPortfolio.findAll({
            where: {
                traderID
            },
            offset,
            limit,
            order: [['updatedAt', 'DESC']],
            transaction
        });

        if ( _.isNull( traderShare ) ) {

            throw new Error( "No Record Found" );

        } else {
            return traderShare
        }

    }

    getTraderPortfolioByCompanyCode = async ( traderID, companyCode, page = 1, limit = AppConfig.defaultListSize, transaction = null ) => {

        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }

        let traderShare = await postgres.TraderPortfolio.findAll({
            where: {
                traderID,
                companyCode
            },
            offset,
            limit,
            order: [['updatedAt', 'DESC']],
            transaction
        });

        if ( _.isNull( traderShare ) ) {

            throw new Error( "No Record Found" );

        } else {
            return traderShare
        }

    }

    addSharesToTraderPortfolio = async ( traderID, companyPayload, totalShares, transaction = null ) => {
        
        let traderPortfolio = await this.getTraderPortfolioOfACompany( traderID, companyPayload.companyID, transaction );

        if ( _.isNull( traderPortfolio ) ) {

            return await this.createTraderPortfolio( traderID, companyPayload, totalShares, transaction );

        }

        let totalSharesNew = parseInt( traderPortfolio.totalShares ) + parseInt( totalShares );

        return await this.updateTraderPortfolio( traderID, companyPayload.companyID, totalSharesNew, transaction );
            
    }

    deductSharesFromTraderPortfolio = async ( traderID, companyPayload, totalShares, transaction = null) => {
        
        let traderPortfolio = await this.getTraderPortfolioOfACompany( traderID, companyPayload.companyID, transaction );

        if ( _.isNull( traderPortfolio ) ) {

            throw new Error( "No record found" );

        }
        
        let totalSharesNew = parseInt( traderPortfolio.totalShares ) - parseInt( totalShares );
        
        return await this.updateTraderPortfolio( traderID, companyPayload.companyID, totalSharesNew, transaction );

    }

}


export default new TraderPortfolioHandler();
