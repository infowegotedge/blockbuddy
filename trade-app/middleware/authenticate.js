import AppConfig from '../config/app-config';

import _ from "lodash";

import TraderHandler from './../handler/trader.handler';

import RedisCacheUtils from '../utils/redis-cache.utils';

const redis = require('../models').redis;

const bbappApiSecretToken = AppConfig.adminAppSecret;

const bbappAdminPassword = AppConfig.adminPassword;

var Auth = {

    authenticateUser : async (req, res, next) => {

        try {

            const { traderauth } = req.headers;

            let trader = await RedisCacheUtils.getDataFromAuthToken( traderauth );

            let nTrader ;//= await RedisCacheUtils.getCachedTrader( trader.traderID );
            
            //if ( _.isNull( nTrader ) ) { //Get Fresh Response
                nTrader = await TraderHandler.getTraderInfo( trader.traderID );
            //}

            if ( _.isNull( nTrader ) ) {
                throw new Error("Trader Record Not found");
            } else {
                req.currentTrader = nTrader;
                next();
            }


        } catch( err ) {
            res.boom.unauthorized( err.toString() );
        }
    },


    authenticateAdmin : async (req, res, next) => {

        try {

            const { traderauth } = req.headers;

            let trader = await RedisCacheUtils.getDataFromAuthToken( traderauth );

            let nTrader = await TraderHandler.getTraderInfo( trader.traderID );

            if ( nTrader.role !== "ADMIN" ) {
                throw new Error("Invalid authorisation");
            }

            if ( _.isNull( nTrader ) || _.isUndefined( nTrader  ) ||  !_.isObject( nTrader ) ) {
                throw new Error("Trader Record Not found");
            } else {
                req.currentTrader = nTrader;
                next();
            }

        } catch( err ) {
            res.boom.unauthorized( err.toString() );
        }
    },

    authenticateAdminApp : async (req, res, next) => {

        try{

            if ( req.query.adminToken == bbappApiSecretToken && req.query.adminPassword == bbappAdminPassword ) {
                
                req.isAdminApp = true;
                next();

            } else {

                throw new Error('Invalid access token');

            }

        } catch ( err ) {

            res.boom.notFound( err.toString() );

        }
        
    }

}


export default Auth;
