import _ from 'lodash';

import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

class QualificationCompensationHandler {

    createNewQualificationCompensation = async( payload, transaction = null ) => {

        return await postgres.QualificationCompensation.create({

            qualificationCompensationID: AppConfig.qualificationCompensationID + randomstring.generate(),
            qualificationID: payload.qualificationID,
            compensationID: payload.compensationID,
            bonusType: payload.bonusType,
            base: payload.base,
            amount: payload.amount

        }, transaction);

    }
    
}


export default new QualificationCompensationHandler();
