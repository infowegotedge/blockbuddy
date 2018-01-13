import AppConfig from '../config/app-config';

import _ from "lodash";

import TraderQualificationMigrationHandler from "../handler/trader-qualification-migration.handler";

import TraderQualificationHandler from "../handler/trader-qualification.handler";

import QualificationHandler from '../handler/qualification.handler';

const sequelize = require('../models').postgres.sequelize;

class TraderQualificationMigration {

    _processNewTraderQualification = async ( traderID, transaction ) => {
        //select free qualification level
        let qualification = await QualificationHandler.getQualificationByCode( AppConfig.freeQualificationLevelCode, transaction );
        
        //create a migration ledger
        let traderQualificationMigration = TraderQualificationMigrationHandler.updateTraderQualificationLevel({
            traderID,
            qualificationID: qualification.qualificationID,
            note: "Trader Migrated to Qualification Level -> " + qualification.qualificationName + " [" + qualification.qualificationCode + "]"
        }, transaction);
        
        //update qualification level of trader
        return await TraderQualificationHandler.createNewTraderQualification({
            qualificationID: qualification.qualificationID,
            qualificationCode: qualification.qualificationCode,
            qualificationName: qualification.qualificationName,
            traderID
        }, transaction );
    }
    
    
    addNewTraderQualification = async ( traderID ) => {
        let _self = this;

            return sequelize.transaction(function (t) {

                return _self._processNewTraderQualification( traderID , t);

            }).then( ( results ) => {
                //Inform notification service
                return results;

            }).catch( ( err ) => {
                throw err;
            });
    }

}


export default new TraderQualificationMigration();
