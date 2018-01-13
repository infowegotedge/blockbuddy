import AppConfig from '../config/app-config';

import _ from "lodash";

var RedisConfig    = AppConfig.redis;

const redis = require('../models').redis;

const uuidv4 = require('uuid/v4');

const AUTH_TOKEN_KEY = "trader-auth-key:";
const TRADER_KEY = "trader:";
const COMPANY_KEY = "company:";

class CacheUtils {

    //=========== TRADER AUTH =====================================================================
    
    saveAuthToken = async ( payload ) => {

        let token = uuidv4();

        await redis.set( AUTH_TOKEN_KEY + token , JSON.stringify( payload ) , 'EX' , RedisConfig.expiryTTL );

        return token;

    }

    getDataFromAuthToken = async ( token ) => {

        if ( _.isNull ( token ) ) {
            throw new Error("Authorisation Token missing");
        }

        let payload = await JSON.parse( await redis.get( AUTH_TOKEN_KEY + token ) );

        if ( _.isNull ( payload ) ) {
            throw new Error("Token expired or unauthorised");
        }

        return payload;

    }

    //=========== TRADER AUTH =====================================================================

    //=========== TRADER =====================================================================
    cacheTrader = async ( traderID, payload ) => {

        payload.isCached = true;

        await redis.set( TRADER_KEY + traderID , JSON.stringify( payload ) , 'EX' , RedisConfig.expiryTTL );

        return true;

    }

    getCachedTrader = async ( traderID ) => {

        if ( _.isNull ( traderID ) ) {
            throw new Error("TraderID invalid");
        }

        return await JSON.parse( await redis.get( TRADER_KEY + traderID ) );

    }

    purgeCachedTrader = async ( traderID ) => {

        if ( _.isNull ( traderID ) ) {
            throw new Error("TraderID invalid");
        }

        return await JSON.parse( await redis.del( TRADER_KEY + traderID ) );

    }
    //=========== TRADER =====================================================================



    setCachedCompany = async ( companyCode , payload ) => {

        let token = companyCode;

        await redis.set( COMPANY_KEY + token , JSON.stringify( payload ) , 'EX' , RedisConfig.expiryTTL );

        return true;

    }

    getCachedCompany = async ( companyCode ) => {

        if ( _.isNull ( companyCode ) ||  _.isUndefined( companyCode ) ) {
            throw new Error("Company Code invalid");
        }

        return await JSON.parse( await redis.get( COMPANY_KEY + companyCode ) );

    }

    
    
}


export default new CacheUtils();
