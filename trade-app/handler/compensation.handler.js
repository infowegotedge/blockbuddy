import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

class CompensationHandler {

    createNewCompensation = async( payload, transaction = null ) => {

        return await postgres.Compensation.create({

            compensationID: AppConfig.compensationID + randomstring.generate(),
            compensationName: payload.compensationName,
            description: payload.description

        }, transaction);

    }

    listActiveCompensation = async(  page = 1, limit = AppConfig.defaultListSize, transaction = null  ) => {

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
            transaction
        };

        return await postgres.Compensation.findAndCountAll( query );
    }

    listAllCompensation  = async( page = 1, limit = AppConfig.defaultListSize, transaction = null  ) => {

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

        return await postgres.Compensation.findAndCount( query );

    }
    
    getCompensationPlan = async( compensationID, transaction = null ) => {

        let compensation =  await postgres.Compensation.findOne( {
            where:{
                compensationID
            },
            order: [['updatedAt', 'DESC']],
            transaction
        });

        if ( _.isNull( compensation ) ) {

            throw new Error("Compensation Plan record not found");

        }

        return compensation;

    }
    
    disableCompensationPlan = async( compensationID, transaction = null ) => {

        return await postgres.Compensation.update(
            {
                isActive: false
            },{
                where: {
                    compensationID
                },
                transaction
            });

    }
    
}


export default new CompensationHandler();
