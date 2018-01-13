import _ from 'lodash';

import AppConfig from '../config/app-config';

import TraderPortfolioLedgerHandler from '../handler/trader-portfolio-ledger.handler';

import TraderWalletLedgerHandler from '../handler/trader-wallet-ledger.handler';

import TraderWalletHandler from '../handler/trader-wallet.handler';

import TraderPortfolioHandler from '../handler/trader-portfolio.handler';

import RedisCacheUtils from '../utils/redis-cache.utils';

import TraderQualification from '../transaction/trader-qualification';

import TradeSellOffer from '../transaction/share-trade.sell-offer';

import TradeBidOffer from '../transaction/share-trade.bid-offer';

import TraderHandler from '../handler/trader.handler';

import CompanyHandler from "../handler/company.handler";

import CoinTransfer from "../transaction/coin-transfer.transaction";

const postgres = require('../models').postgres;

const sequelize = require('../models/postgres/index').sequelize;

class TraderController {

    
    getAuthTokenAction = async ( req, res ) => {
        
        try{

            let trader = await TraderHandler.getTraderInfoByUserName( req.query.username );

            let token = await RedisCacheUtils.saveAuthToken( trader.getAuthTokenPayload );

            res.json({
                message: "Authorised trade token generated for : " + req.query.username ,
                authToken: token
            });
        } catch ( err ) {
            
            res.boom.notFound( err.toString() );
            
        }

    }

    getAdminAuthTokenAction = async ( req, res ) => {

        try{

            if ( req.query.adminToken == bbappApiSecretToken ) {

                let trader = await this.getAdminTrader();

                if ( !_.isObject( trader ) ) {
                    throw new Error( "No record found" )
                } else {

                    let token = await CacheUtils.saveAuthToken( trader.getAuthTokenPayload );

                    res.status(201).json({
                        message: "Authorised trade token generated for admin",
                        authToken: token
                    });
                }

            } else {

                res.boom.unauthorized('Invalid access token');

            }

        } catch ( err ) {
            res.boom.notFound('No record found');
        }

    }

    getInfoAction = async(  req, res ) => {
        try{

            res.json({ message: "Record Fetched", data : req.currentTrader.getRecord })

        } catch ( err ) {

            res.boom.notFound('No record found');

        }

    }

    getWalletAction = async(  req, res ) => {
        try{

            let twallet = await TraderWalletHandler.getTraderWallet( req.currentTrader.traderID, req.query.page, req.query.limit );

            res.json({
                message: "Trader Wallet fetched",
                data : twallet
            });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }

    getPortfolioAction = async( req, res ) => {
        try{

            let list = await TraderPortfolioHandler.getTraderPortfolio( req.currentTrader.traderID, req.query.page, req.query.limit  );

            let data = [];

            for( let i = 0; i < list.length ; i++ ) {

                let meta = await postgres.Offer.find({
                    where: {
                        offerType: "SELL-SHARE",
                        isAvailable: false,
                        companyCode: list[i].companyCode,
                        consumedBy: req.currentTrader.traderID
                    },
                    attributes: [
                        [sequelize.fn('AVG', sequelize.col('tradeUnitPrice')), "averageUnitPrice"],
                        [sequelize.fn('AVG', sequelize.col('tradeTotalShares')), "averageTotalShares"]
                    ]
                });

                data.push({
                    record: list[i],
                    blendedProfile: meta.dataValues
                });

            }
            
            res.json({
                message: "Trader Portfolio fetched",
                data
            });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }
    
    getPortfolioByCompanyCodeAction = async(  req, res ) => {
        try{

            res.json({
                message: "Trader Portfolio fetched",
                data : await TraderPortfolioHandler.getTraderPortfolioByCompanyCode( req.currentTrader.traderID, req.params.companyCode, req.query.page, req.query.limit  )
            });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }
    
    createTraderAccountAction = async( req, res ) => {
        try {
    
            res.json({ message: "New Trader Created", data : await TraderQualification.registerNewTrader( req.body ) });
    
        } catch ( err ) {
    
            res.boom.badRequest( err.toString() );
    
        }
    }

    listAllTradersAction = async( req, res ) => {
        try {

            let list = await TraderHandler.getTraderList( req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                _data.push( item.getRecord );

            });

            res.json({
                message: "Trader list generated",
                data: _data,
                count: list.count,
                currentPage: (( req.query.page ) ? 1 : req.query.page)
            })

        } catch (err) {
            res.boom.badRequest(err.toString());
        }
    }

    updateTraderAction = async( req, res ) => {
        try{
            if ( req.currentTrader.traderID == req.params.traderID ) {
                throw new Error( "Cannot perform this action on admin" );
            }
            res.json({ message: "Trader Account updated", data : await TraderHandler.updateTraderProfile( req.params.traderID , req.body ) });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }

    disableTraderAction = async( req, res ) => {
        try{
            if ( req.currentTrader.traderID == req.params.traderID ) {
                throw new Error( "Cannot perform this action on admin" );
            }
            res.json({ message: "Trader Account disabled", data : await TraderHandler.disableTraderProfile ( req.params.traderID ) });

        } catch ( err ) {

            res.boom.badRequest( err.toString() );

        }
    }

    getPortfolioLedgerAction = async( req, res ) => {
        
        try {

            let list = await TraderPortfolioLedgerHandler.listPortfolioLedgerOfATrader( req.query.companyCode, req.currentTrader.traderID, req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                let record = item.getRecord;
                
                if ( record.to === req.currentTrader.traderID ) {
                  
                    record.to = req.currentTrader.firstName + req.currentTrader.lastName;
                    record.from = "SYSTEM ( " + record.from + " )";
                    
                } 
                
                if ( record.from == req.currentTrader.traderID  ) {

                    record.from = req.currentTrader.firstName + req.currentTrader.lastName;
                    record.to = "SYSTEM ( " + record.to + " )";
                    
                }
                
                _data.push( record );

            });

            res.json({
                message: "Trader portfolio list generated",
                data: _data,
                count: list.count,
                currentPage: (( req.query.page ) ? 1 : req.query.page)
            })

        } catch (err) {
            res.boom.badRequest(err.toString());
        }

    }

    getWalletLedgerAction = async( req, res ) => {

        try {

            let list = await TraderWalletLedgerHandler.listWalletLedgerOfATrader( req.query.currencyCode, req.currentTrader.traderID, req.query.page, req.query.limit );

            let _data = [];

            _.forEach( list.rows , function( item ) {

                let record = item.getRecord;

                if ( record.to === req.currentTrader.traderID ) {

                    record.to = req.currentTrader.firstName + req.currentTrader.lastName;
                    record.from = "SYSTEM ( " + record.from + " )";

                }

                if ( record.from == req.currentTrader.traderID  ) {

                    record.from = req.currentTrader.firstName + req.currentTrader.lastName;
                    record.to = "SYSTEM ( " + record.to + " )";

                }

                _data.push( record );

            });

            res.json({
                message: "Trader Wallet ledger fetched",
                data: _data,
                count: list.count,
                currentPage: (( req.query.page ) ? 1 : req.query.page)
            })

        } catch (err) {
            res.boom.badRequest(err.toString());
        }
        
    }

    createSellOfferAction = async( req, res ) => {
        try{
           
            res.json( await TradeSellOffer.createSellOffer( 
                req.currentTrader.traderID,
                req.body.totalShares,
                req.body.unitPrice,
                req.body.companyCode,
            ));

        } catch ( err ) {

            res.json({
                isError: true,
                message: err.toString(),
                statusCode: 412
            });

        }
    }

    acceptSellOfferAction = async( req, res ) => {
        try{

            res.json( await TradeSellOffer.acceptSellOffer(
                req.currentTrader.traderID,
                req.body.offerID
            ));

        } catch ( err ) {

            res.json({
                isError: true,
                message: err.toString(),
                statusCode: 412
            });

        }
    }
    
    
    createBidOfferAction = async( req, res ) => {
        try{

            res.json( await TradeBidOffer.createBidOffer(
                req.currentTrader.traderID,
                req.body.totalShares,
                req.body.unitPrice,
                req.body.companyCode,
            ));

        } catch ( err ) {

            res.json({
                isError: true,
                message: err.toString(),
                statusCode: 412
            });

        }
    }
    
    acceptBidOfferAction = async( req, res ) => {
        try{

            res.json( await TradeBidOffer.acceptBidOffer(
                req.currentTrader.traderID,
                req.body.offerID
            ));

        } catch ( err ) {

            res.json({
                isError: true,
                message: err.toString(),
                statusCode: 412
            });

        }
    }


    transferCoinsAction = async( req, res ) => {

        try{

            let fromTraderObj = req.currentTrader;

            let toTraderObj = await TraderHandler.getTraderInfoByUserName( req.body.receiver );

            let companyObj = await CompanyHandler.getCompanyAllInfo( req.body.companyCode );

            if ( fromTraderObj.traderID == toTraderObj.traderID ) {
                throw new Error("Nice try, come tomorrow");
            }

            await CoinTransfer.transferCoins( fromTraderObj, toTraderObj, companyObj, parseFloat( req.body.total ))

            res.json( {message: "Transfer Complete"} );

        } catch ( err ) {

            res.json({
                isError: true,
                message: err.toString(),
                statusCode: 412
            });

        }

    }
    

}


export default new TraderController();
