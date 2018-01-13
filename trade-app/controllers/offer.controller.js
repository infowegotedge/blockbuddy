import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

const sequelize = require('../models/postgres/index').sequelize;

class OfferController {

    createOffer = async ( payload, transaction = null ) => {
        
        let offer = await postgres.Offer.create({
            offerType: payload.offerType,
            tradeUnitPrice: payload.tradeUnitPrice,
            tradeTotalAmount: payload.tradeTotalAmount,
            tradeTotalShares: payload.tradeTotalShares,
            systemPortfolioLedgerID: payload.systemPortfolioLedgerID,
            systemWalletLedgerID: payload.systemWalletLedgerID,
            createdBy: payload.createdBy,
            companyCode: payload.companyCode,
            companyID: payload.companyID
        }, { transaction });

        return offer;
        
        
    }


    seedOffer = async ( payload, transaction = null ) => {

        let offer = await postgres.Offer.create({
            offerType: payload.offerType,
            tradeUnitPrice: payload.tradeUnitPrice,
            tradeTotalAmount: payload.tradeTotalAmount,
            tradeTotalShares: payload.tradeTotalShares,
            systemLedgerID: payload.systemLedgerID,
            createdBy: payload.createdBy,
            companyCode: payload.companyCode,
            companyID: payload.companyID
        }, { transaction });

        return offer;


    }

    getOfferByID = async( offerID, transaction = null  ) => {
        let offer = await postgres.Offer.findOne({
            where: {
                offerID
            },
            transaction
        });

        if ( _.isNull( offer ) ) {
            throw new Error( "Offer not found" );
        }

        return offer;
    }

    getAvailableBidOfferByID = async( offerID, transaction = null  ) => {
        let offer = await postgres.Offer.findOne({
            where: {
                offerID,
                isAvailable: true,
                consumedBy: null,
                offerType: "BUY-SHARE"
            },
            include: [
                { model: postgres.Company },
                { model: postgres.Trader },
                { model: postgres.SystemWalletLedger }
            ],
            transaction
        });

        if ( _.isNull( offer ) ) {
            throw new Error( "Offer not found" );
        }

        return offer;
    }

    getAvailableSellOfferByID = async( offerID, transaction = null  ) => {
        let offer = await postgres.Offer.findOne({
            where: {
                offerID,
                isAvailable: true,
                consumedBy: null,
                offerType: "SELL-SHARE"

            },
            include: [
                { model: postgres.Company },
                { model: postgres.Trader },
                { model: postgres.SystemPortfolioLedger }
            ],
            transaction
        });

        if ( _.isNull( offer ) ) {
            throw new Error( "Offer not found" );
        }

        return offer;
    }

    disableOffer = async( offerID, consumedBy, transaction = null  ) => {
        let offer = await postgres.Offer.update(
            {
                isAvailable: false, 
                consumedBy
                
            },
            {
                where: {
                    offerID
                },
                transaction    
            }
        );
        
        return offer;
    }
    
    listAllOffer = async( page = 1, limit = 25 ) => {
        let offset = 0;

        if (page > 1) {
            offset = (page - 1) * limit;
        }

        return await postgres.Offer.findAll({
            offset,
            limit,
            order: [['updatedAt', 'DESC']]
        });
    }
    
    listAvailableOffer = async( page = 1, limit = 25 ) => {

        let offset = 0;

        if (page > 1) {
            offset = (page - 1) * limit;
        }

        return await postgres.Offer.findAll({
            where: {
                isAvailable: true
            },
            offset,
            limit,
            order: [['updatedAt', 'DESC']]
        });

    }

    listClosedAvailableOffer = async( companyCode, page = 1, limit = 200 ) => {

        let offset = 0;

        if (page > 1) {
            offset = (page - 1) * limit;
        }

        let meta1 =  await postgres.Offer.findAll({
            where: {
                isAvailable: false,
                companyCode
            },
            attributes: [
                [sequelize.fn('MIN', sequelize.col('tradeUnitPrice')), "minimum"],
                [sequelize.fn('MAX', sequelize.col('tradeUnitPrice')), "maximum"],
                [sequelize.fn('AVG', sequelize.col('tradeUnitPrice')), "average"]
            ]
        });

        let meta2 = await postgres.Offer.findAndCount ({
            where: {
                isAvailable: false,
                companyCode
            },
            attributes: [
                'companyCode',
                'tradeUnitPrice',
                "updatedAt"
            ],
            offset,
            limit,
            order: [['updatedAt', 'ASC']]
        });

        return {
            stats: meta1,
            report: meta2
        }

    }

    listAvailableSellOffer = async( companyCode, page = 1, limit = 25 ) => {

        let offset = 0;

        if (page > 1) {
            offset = (page - 1) * limit;
        }

        return await postgres.Offer.findAll({
            where: {
                isAvailable: true,
                companyCode,
                offerType: "SELL-SHARE"
            },
            offset,
            limit,
            order: [['updatedAt', 'DESC']]
        });
    }

    listAvailableBidOffer = async( companyCode, page = 1, limit = 25 ) => {

        let offset = 0;

        if (page > 1) {
            offset = (page - 1) * limit;
        }

        return await postgres.Offer.findAll({
            where: {
                isAvailable: true,
                companyCode,
                offerType: "BUY-SHARE"
            },

            offset,
            limit,
            order: [['updatedAt', 'DESC']]
        });
    }

    //====== Routes Action ========================================================

    listAvailableOfferAction = async ( req, res ) => {

        try{

            res.status(201).json({
                message: "Available Offers fetched",
                data: await this.listAvailableOffer( req.query.page, req.query.limit )
            })

        } catch ( err ) {
            res.boom.badRequest( err.toString() );
        }

    }

    listClosedAvailableOfferAction = async ( req, res ) => {
        try{

            let list = await this.listClosedAvailableOffer( req.query.companyCode, req.query.page, req.query.limit );

            res.status(201).json({
                message: "Available Offers fetched",
                data: list,
                currentPage: (( req.query.page ) ?  req.query.page : 1 ),
                count: list.report.count

            })

        } catch ( err ) {
            res.boom.badRequest( err.toString() );
        }

    }

    listAvailableOfferByTypeAndCompanyAction  = async ( req, res ) => {

        try{

            if ( req.params.type === "SELL" ) {
                res.status(201).json({
                    message: "Available Sell Offers fetched",
                    data: await this.listAvailableSellOffer( req.params.companyCode, req.query.page, req.query.limit )
                });
            } else {
                res.status(201).json({
                    message: "Available Bid Offers fetched",
                    data: await this.listAvailableBidOffer( req.params.companyCode, req.query.page, req.query.limit )
                });
            }


        } catch ( err ) {
            res.boom.badRequest( err.toString() );
        }

    }


}


export default new OfferController();
