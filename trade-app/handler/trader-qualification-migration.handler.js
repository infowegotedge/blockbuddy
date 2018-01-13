import AppConfig from '../config/app-config';

const postgres = require('../models').postgres;

import randomstring from "randomstring";

class TraderQualificationMigrationHandler {

    updateTraderQualificationLevel =  async( payload, transaction = null) => {

        return await postgres.TraderQualificationMigration.create(
            {
                traderQualificationMigrationID: AppConfig.traderQualificationMigrationID + randomstring.generate(),
                traderID: payload.traderID,
                qualificationID: payload.qualificationID,
                note: payload.note
            },
            {transaction}
        );

    }

}


export default new TraderQualificationMigrationHandler();
