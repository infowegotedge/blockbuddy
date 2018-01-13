import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

class CurrencyHandler {

    listCurrencies = async( page = 1, limit = AppConfig.defaultListSize, transaction = null  ) => {


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

        return await postgres.Currency.findAndCount( query );
    }
    
    createNewCurrency = async( payload, transaction = null ) => {

        return await postgres.Currency.create({

            currencyID: AppConfig.currencyID + randomstring.generate(),
            currencyCode: payload.currencyCode,
            currencyName: payload.currencyName,
            description: payload.description

        }, transaction);

    }

    getCurrencyInfo = async( currencyID, transaction = null ) => {

        let currency =  await postgres.Currency.findOne( {
            where:{
                currencyID
            },
            order: [['updatedAt', 'DESC']],
            transaction
        });

        if ( _.isNull( currency ) ) {

            throw new Error("Currency record not found");

        }

        return currency;

    }
    
    getCurrencyInfoByCode = async( currencyCode, transaction = null ) => {

        let currency =  await postgres.Currency.findOne( {
            where:{
                currencyCode
            },
            order: [['updatedAt', 'DESC']],
            transaction
        });

        if ( _.isNull( currency ) ) {

            throw new Error("Currency record not found");

        }

        return currency;

    }

    updateCurrency = async( currencyCode, payload, transaction = null ) => {

        return await postgres.Currency.update(
            {
                currencyName: payload.currencyName,
                description: payload.description
            },{
                where: {
                    currencyCode
                },
                transaction
            });

    }
}


export default new CurrencyHandler();
