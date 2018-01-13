import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

const uuidv4 = require('uuid/v4');

import randomstring from "randomstring";

class TraderPortfolioController {


    getTraderPortfolioOfACompany = async ( traderID, companyID, transaction = null ) => {
        return await postgres.TraderPortfolio.findOne({
            where: {
                traderID,
                companyID
            },
            transaction
        });
    }
    

    createTraderPortfolio = async ( traderID, companyID, totalShares, companyCode, companyName, transaction = null ) => {

        totalShares = parseInt( totalShares );
        
        if ( totalShares < 0 ) {
            throw new Error( "Total Shares cannot be negative" );
        }

        return await postgres.TraderPortfolio.create(
            {
                traderPortfolioID: AppConfig.traderPortfolioID + randomstring.generate(),
                traderID,
                companyID,
                totalShares,
                companyCode,
                companyName
            },
            transaction
        );
        
    }

    updateTraderPortfolio = async( traderID, companyID, totalShares, transaction = null ) => {

        totalShares = parseInt( totalShares );

        if ( totalShares < 0 ) {
            throw new Error( "Total Shares cannot be negative" );
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
            transaction
        });

        if ( _.isNull( traderShare ) ) {

            throw new Error( "No Record Found" );

        } else {
            return traderShare
        }

    }

    addSharesToTraderPortfolio = async ( traderID, companyID, totalShares, companyCode, companyName, transaction = null ) => {

        let traderPortfolio = await this.getTraderPortfolioOfACompany( traderID, companyID, transaction );

        if ( _.isNull( traderPortfolio ) ) {

            return await this.createTraderPortfolio( traderID, companyID, totalShares, companyCode, companyName, transaction );

        }

        let totalSharesNew = parseInt( traderPortfolio.totalShares ) + parseInt( totalShares );

        return await this.updateTraderPortfolio( traderID, companyID, totalSharesNew, transaction );
            
    }

    deductSharesFromTraderPortfolio = async ( traderID, companyID, totalShares , transaction = null) => {
        
        let traderPortfolio = await this.getTraderPortfolioOfACompany( traderID, companyID, transaction );
        
        let totalSharesNew = parseInt( traderPortfolio.totalShares ) - parseInt( totalShares );

        return await this.updateTraderPortfolio( traderID, companyID, totalSharesNew, transaction );

    }

}


export default new TraderPortfolioController();
