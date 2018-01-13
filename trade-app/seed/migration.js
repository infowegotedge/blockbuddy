import AppConfig from '../config/app-config';

import TraderHandler from '../handler/trader.handler';

import QualificationHandler from '../handler/qualification.handler';

import TraderQualificationHandler from '../handler/trader-qualification.handler';

import TraderQualificationMigrationHandler from '../handler/trader-qualification-migration.handler';

import randomstring from "randomstring";

const postgres = require('../models').postgres;

var faker = require("faker");

var _ = require('lodash');

var moment = require('moment');

class Migrate {

    migrate = async () => {

        let allRecords = await TraderHandler.getAllRecords( 60000 );//10000

        let qualification = await QualificationHandler.getQualificationByCode( AppConfig.freeQualificationLevelCode );

        let _records = [];

        _.forEach( allRecords, async( record ) => {

            let tmp = {
                traderQualificationMigrationID: AppConfig.traderQualificationMigrationID + randomstring.generate(),
                qualificationID: qualification.qualificationID,
                qualificationCode: qualification.qualificationCode,
                qualificationName: qualification.qualificationName,
                traderID: record.traderID,
                note: "Default FREE Qualification Level Assignment on new registeration"
            };

            _records.push( tmp );

        });

        // _.forEach( allRecords, async( record ) => {
        //
        //     let payload = {
        //         qualificationID: qualification.qualificationID,
        //         qualificationCode: qualification.qualificationCode,
        //         qualificationName: qualification.qualificationName,
        //         traderID: record.traderID
        //     };

            //let traderQualification = await postgres.TraderQualification.bulkCreate( _records );
            //
            let traderQualificationMigration = await postgres.TraderQualificationMigration.bulkCreate( _records );

            console.log(">>>",  traderQualificationMigration);
        //
        // });

    }

}
export default new Migrate();