import _ from 'lodash';

import AppConfig from '../config/app-config';

import randomstring from "randomstring";

import RedisCacheUtils from '../utils/redis-cache.utils';

const postgres = require('../models').postgres;

class TraderHandler {
    
    getTraderInfo = async( traderID, transaction = null) => {
        let trader = await postgres.Trader.findOne(
            {
                where: {
                    traderID
                },
                order: [['updatedAt', 'DESC']],
                transaction
            }
        );
        
        if ( _.isNull( trader ) ) {
            throw new Error("Trader Record not found");
        }
        
        //Cache Trader
        await RedisCacheUtils.cacheTrader( traderID, trader );
        
        return trader;
    }

    getTraderInfoByUserName = async( userName, transaction = null) => {

        let trader = await postgres.Trader.findOne(
            {
                where: {
                    userName
                },
                transaction
            }
        );

        if ( _.isNull( trader ) ) {
            throw new Error("Trader Record not found");
        }

        //Cache Trader
        //await RedisCacheUtils.cacheTrader( trader.traderID, trader );

        return trader;
    }

    getAdminTrader = async() => {
        return await postgres.Trader.findOne({ where: { role : "ADMIN", userName: "bbapp" } });
    }
    
    getTraderList = async( page = 1, limit = AppConfig.defaultListSize, transaction = null) => {


        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }

        let query = {
            where: { role: "TRADER" },
            offset,
            limit,
            order: [['updatedAt', 'DESC']],
            transaction
        };

        return await postgres.Trader.findAndCount( query );
    }
    
    updateTraderProfile = async( traderID, payload, transaction = null ) => {

        return await postgres.Trader.update(
            {
                firstName: payload.firstName,
                lastName: payload.lastName,
                contactNumber: payload.contactNumber,
                address: payload.address,
                country: payload.country,
                locale: payload.locale,
                isKycApproved: payload.isKycApproved,
                isActive: payload.isActive
            },
            {
                where: {
                    traderID
                },
                transaction
            }
        );

    }

    disableTraderProfile = async( traderID, transaction = null ) => {
        
        return await postgres.Trader.update(
            {
                isActive: false
            },
            {
                where: {
                    traderID
                },
                transaction
            }
        );
    }
    
    createAdminProfile = async( traderPayload, transaction = null ) => {
        let trader = await postgres.Trader.create({
            traderID: AppConfig.traderID + randomstring.generate(),
            firstName: traderPayload.firstName,
            lastName: traderPayload.lastName,
            userName: traderPayload.userName,
            email: traderPayload.email,
            contactNumber: traderPayload.contactNumber,
            address: traderPayload.address,
            country: traderPayload.country,
            locale: traderPayload.locale,
            role: "ADMIN",
            isKycApproved: true
        }, {transaction});
        return trader.getCompleteRecord;
    }
    
    createNewTraderProfile = async( traderPayload, transaction = null ) => {
       let trader = await postgres.Trader.create({
            traderID: AppConfig.traderID + randomstring.generate(),
            firstName: traderPayload.firstName,
            lastName: traderPayload.lastName,
            userName: traderPayload.userName,
            email: traderPayload.email,
            contactNumber: traderPayload.contactNumber,
            address: traderPayload.address,
            country: traderPayload.country,
            locale: traderPayload.locale
        }, {transaction} );
        return trader.getCompleteRecord;
    }

    getAllRecords = async( offset = 0 ) => {
        return postgres.Trader.findAll({ offset, limit: 10000 });
    }
    

}


export default new TraderHandler();
