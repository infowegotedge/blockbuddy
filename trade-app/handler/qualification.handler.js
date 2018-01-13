import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

class QualificationHandler {

    createNewQualification = async( payload, transaction = null ) => {

        return await postgres.Qualification.create({

            qualificationID: AppConfig.qualificationID + randomstring.generate(),
            qualificationName: payload.qualificationName,
            qualificationCode: payload.qualificationCode,
            description: payload.description,
            constraints: payload.constraints

        }, transaction);

    }

    listActiveQualifications = async( page = 1, limit = AppConfig.defaultListSize, transaction = null  ) => {

        let offset = 0;

        if ( page > 1 ) {
            offset = (page - 1) * limit;
        }

        let query = {
            where: {
                isActive: true
            },
            offset,
            limit,
            order: [['updatedAt', 'DESC']],
            transaction
        };

        return await postgres.Qualification.findAndCountAll( query );
    }

    listAllQualification = async( page = 1, limit = AppConfig.defaultListSize, transaction = null  ) => {

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

        return await postgres.Qualification.findAndCount( query );

    }

    getQualification = async( qualificationID, transaction = null ) => {

        let qualification =  await postgres.Qualification.findOne( {
            where:{
                qualificationID
            },
            order: [['updatedAt', 'DESC']],
            transaction
        });

        if ( _.isNull( qualification ) ) {

            throw new Error("Qualification record not found");

        }

        return qualification;

    }

    getQualificationByCode = async( qualificationCode, transaction = null ) => {

        let qualification =  await postgres.Qualification.findOne( {
            where:{
                qualificationCode
            },
            transaction
        });

        if ( _.isNull( qualification ) ) {

            throw new Error("Qualification record not found");

        }

        return qualification;

    }

    disableQualificationByCode = async( qualificationCode, transaction = null ) => {

        return await postgres.Qualification.update(
            {
                isActive: false
            },{
                where: {
                    qualificationCode
                },
                transaction
            });

    }

    updateQualification = async( qualificationCode, payload,  transaction = null ) => {

        return await postgres.Qualification.update(
            {
                qualificationName: payload.qualificationName,
                description: payload.description
            }, {
                where: {
                    qualificationCode
                },
                transaction
            });

    }


}


export default new QualificationHandler();
