import QualificationCompensationHandler from '../handler/qualification-compensation.handler';
import QualificationHandler from '../handler/qualification.handler';
import CompensationHandler from '../handler/compensation.handler';

import _ from "lodash";

var faker = require("faker");

var moment = require('moment');

class QualificationCompensationTestSuit {
    
    createQualificationCompensation = async () => {

        let qualificationList = [], tmp = null, list = [];
        let compensationPlanList = [];

        _.forEach( (await QualificationHandler.listActiveQualifications()).rows,  async( qualification ) => {
            qualificationList.push( qualification.getAdminRecord );
        });

        _.forEach((await CompensationHandler.listActiveCompensation()).rows, async( compensationPlan ) => {
            compensationPlanList.push( compensationPlan.getAdminRecord );
        });

        //console.log( ">>>> -------", qualificationList, compensationPlanList );

        
        _.forEach( qualificationList, async( qualification ) => {

            if ( qualification.qualificationCode == "FREE" ) {

                tmp = {
                    qualificationID: qualification.qualificationID,
                    compensationID: (_.find( compensationPlanList, {compensationName: "Direct Sales Bonus" } )).compensationID,
                    bonusType: "PERCENTAGE",
                    base: "PURCHASE",
                    amount: 6
                };
                list.push( await QualificationCompensationHandler.createNewQualificationCompensation( tmp ) );
                
            }

            if ( qualification.qualificationCode == "MARKETING-PARTNER" ) {

                tmp = {
                    qualificationID: qualification.qualificationID,
                    compensationID: (_.find( compensationPlanList, { compensationName: "Direct Sales Bonus" } )).compensationID,
                    bonusType: "PERCENTAGE",
                    base: "PURCHASE",
                    amount: 13
                }

                list.push( await QualificationCompensationHandler.createNewQualificationCompensation( tmp ) );

            }

            if ( qualification.qualificationCode == "PEARL" ) {

                tmp = {
                    qualificationID: qualification.qualificationID,
                    compensationID: (_.find( compensationPlanList, {compensationName: "Direct Sales Bonus" } )).compensationID,
                    bonusType: "PERCENTAGE",
                    base: "PURCHASE",
                    amount: 19
                }

                list.push( await QualificationCompensationHandler.createNewQualificationCompensation( tmp ) );

            }

            if ( qualification.qualificationCode == "SAPPHIRE" ) {

                tmp = {
                    qualificationID: qualification.qualificationID,
                    compensationID: (_.find( compensationPlanList, {compensationName: "Direct Sales Bonus" } )).compensationID,
                    bonusType: "PERCENTAGE",
                    base: "PURCHASE",
                    amount: 22
                }

                list.push( await QualificationCompensationHandler.createNewQualificationCompensation( tmp ) );

            }

            
        })
        

        return list;

    }
}
export default new QualificationCompensationTestSuit();