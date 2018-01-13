import AppConfig from '../config/app-config';

import _ from "lodash";

import TraderHandler from '../handler/trader.handler';

import QualificationHandler from '../handler/qualification.handler';

import TraderQualificationHandler from '../handler/trader-qualification.handler';

import TraderQualificationMigrationHandler from '../handler/trader-qualification-migration.handler';

const sequelize = require('../models').postgres.sequelize;

class TraderQualification {

    _processNewTraderRegisteration =  async ( traderPayload, transaction ) => {

        /**
         * Strategy
         * # Register new Trader
         * # Find FREE Qualification Level
         * # Check if the qualification level is active or not
         * # check any constraints
         * # Move user to FREE qualification level
         * # Update TraderQualification Migration Record
         */
        
        let trader = await TraderHandler.createNewTraderProfile( traderPayload, transaction  );
        
        let qualification = await QualificationHandler.getQualificationByCode( AppConfig.freeQualificationLevelCode, transaction );
        
        if ( !qualification.isActive ) {
            throw new Error("Qualification Level Inactive");
        }
        
        //@TODO Constraint Check

        let payload = {
            qualificationID: qualification.qualificationID,
            qualificationCode: qualification.qualificationCode,
            qualificationName: qualification.qualificationName,
            traderID: trader.traderID
        };
        
        let traderQualification = await TraderQualificationHandler.createNewTraderQualification( payload, transaction );

        payload.note = "Default FREE Qualification Level Assignment on new registeration";

        let traderQualificationMigration = await TraderQualificationMigrationHandler.updateTraderQualificationLevel( payload , transaction);

        return trader;
        
    }

    registerNewTrader = ( traderPayload ) => {

        let _self = this;

        return sequelize.transaction(function (t) {

            return _self._processNewTraderRegisteration( traderPayload , t);

        }).then( ( results ) => {
            //Inform notification service
            return {
                message: "Trader successfully saved with FREE Qualification Level",
                data: results
            }
        }).catch( ( err ) => {
            throw err;
        });

    }

}


export default new TraderQualification();
