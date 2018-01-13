import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

import TraderQualificationMigration from "../transaction/trader-qualification-migration";

import TraderQualificationMigrationHandler from "../handler/trader-qualification-migration.handler";

class TraderQualificationHandler {

    createNewTraderQualification = async( payload, transaction = null ) => {

        return await postgres.TraderQualification.create({

            traderQualificationID: AppConfig.traderQualificationID + randomstring.generate(),

            qualificationID: payload.qualificationID,

            qualificationCode: payload.qualificationCode,

            qualificationName: payload.qualificationName,

            traderID: payload.traderID

        }, transaction);

    } 
    
    updateTraderQualification = async( payload, transaction = null ) => {

        let traderQualification =  await postgres.TraderQualification.update(
            {
                qualificationID: payload.qualificationID,
    
                qualificationCode: payload.qualificationCode,

                qualificationName: payload.qualificationName
            }, {
                where: {
                    traderID: payload.traderID
                },
                transaction
            });

        if ( traderQualification == 0 ) {

            //Create Default Free Qualification level for the customer
            return await TraderQualificationMigration.addNewTraderQualification( payload.traderID );

        } else {

            payload.note = "Trader Migrated to Qualification Level -> " + payload.qualificationName + " [" + payload.qualificationCode + "]";

            await TraderQualificationMigrationHandler.updateTraderQualificationLevel( payload, transaction );

        }

        return traderQualification;

    }

    getTraderQualification = async( traderID, transaction = null ) => {
    
        let traderQualification = await postgres.TraderQualification.find({
    
            where: {
                traderID
            },
            order: [['updatedAt', 'DESC']],
            include: [{ model: postgres.Qualification }]
    
        }, transaction);

        if ( _.isNull( traderQualification ) ) {
            
            //Create Free Qualification level for the customer
            return await TraderQualificationMigration._processNewTraderQualification( traderID, transaction );
            
        }

        return traderQualification;

    }
    
    
}


export default new TraderQualificationHandler();
