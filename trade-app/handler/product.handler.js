import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

class ProductHandler {

    createNewProduct = async( payload, transaction = null ) => {

        //TODO 
        //Check before saving that company code and currency code exits
        //Check check unique constraints for company code and currency code
        
        return await postgres.Product.create({
            productID: AppConfig.productID + randomstring.generate(),
            productType: payload.productType,
            productSku: payload.productSku,
            description: payload.description,
            productName: payload.productName,
            productMeta: payload.productMeta,
            sellingPrice: payload.sellingPrice,
            compensationWallet: payload.compensationWallet,
            compensationPortfolio: payload.compensationPortfolio,
            compensation: payload.compensation,
            isRecurring: payload.isRecurring,
            isActive: payload.isActive
        }, transaction);

    }

    updateProduct = async( sku, payload, transaction = null ) => {

        return await postgres.Product.update(
            {
                productType: payload.productType,
                description: payload.description,
                productName: payload.productName,
                productMeta: payload.productMeta,
                isRecurring: payload.isRecurring
            },
            {
                where: {
                    sku
                },
                transaction
            });

    }


    disableProduct = async( productSku, transaction = null ) => {

        return await postgres.Product.update(
            {
                isActive: false
            },
            {
                where: {
                    productSku
                },
                transaction
            });

    }
    
    listAllProducts= async( page = 1, limit = AppConfig.defaultListSize, transaction = null  ) => {

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

        return await postgres.Product.findAndCount( query );
    }

    listStaticProducts = async( page = 1, limit = AppConfig.defaultListSize, transaction = null  ) => {

        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }

        let query = {
            where: {
                productType: "STATIC",
                isActive: true
            },
            offset,
            limit,
            order: [['updatedAt', 'DESC']],
            transaction
        };

        return await postgres.Product.findAndCount( query );

    }

    listSubscriptionProducts = async( page = 1, limit = AppConfig.defaultListSize, transaction = null  ) => {

        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }

        let query = {
            where: {
                productType: "SUBSCRIPTION",
                isActive: true
            },
            offset,
            limit,
            order: [['updatedAt', 'DESC']],
            transaction
        };

        return await postgres.Product.findAndCount( query );

    }

    getProductInfo = async( productSku, transaction = null ) => {

        let currency =  await postgres.Product.findOne( {
            where:{
                productSku
            },
            order: [['updatedAt', 'DESC']],
            transaction
        });

        if ( _.isNull( currency ) ) {

            throw new Error("Product record not found");

        }

        return currency;

    }
}


export default new ProductHandler();
