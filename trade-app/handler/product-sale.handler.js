import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

class ProductSaleHandler {

    createNewProductSaleRecord = async( payload, transaction = null ) => {

        return await postgres.ProductSale.create({

            productSaleID: AppConfig.productSaleID + randomstring.generate(),
            gatewayResponse: payload.gatewayResponse,
            note: payload.note,
            orderTotal: payload.orderTotal,
            orderID: payload.orderID,
            productSku: payload.productSku,
            productID: payload.productID,
            traderID: payload.traderID,
            sponsorUserName: payload.sponsorUserName,
            isProcessed: payload.isProcessed
        }, transaction);

    }

    processProductSale = async( productSaleID, transaction = null ) => {

        return await postgres.ProductSale.update(
            {
                isProcessed: true
            },{
                where: {
                    productSaleID
                },
                transaction
            });

    }

    getProductSaleRecord = async( productSaleID, transaction = null ) => {

        let productSale =  await postgres.ProductSale.findOne( {
            where:{
                productSaleID
            },
            order: [['updatedAt', 'DESC']],
            transaction
        });

        if ( _.isNull( productSale ) ) {

            throw new Error("Product Sale record not found");

        }

        return productSale;

    }

    listUnprocessedProductSale = async( page = 1, limit = AppConfig.defaultListSize, transaction = null  ) => {

        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }
        let query = {
            where: {
                isProcessed: false
            },
            offset,
            limit,
            order: [['updatedAt', 'DESC']],
            transaction
        };

        return await postgres.ProductSale.findAndCountAll( query );
    }

    listProcessedProductSale = async( page = 1, limit = AppConfig.defaultListSize, transaction = null  ) => {

        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }
        let query = {
            where: {
                isProcessed: true
            },
            offset,
            limit,
            order: [['updatedAt', 'DESC']],
            transaction
        };

        return await postgres.ProductSale.findAndCountAll( query );
    }
}


export default new ProductSaleHandler();
