import CompensationHandler from '../handler/compensation.handler';

var faker = require("faker");

var moment = require('moment');

class CompensationTestSuit {
    
    createCompensationPlan = async () => {

        var list = [];

        let tmp = {
            compensationName: "Direct Sales Bonus",
            description: ""
        };

        list.push(  await CompensationHandler.createNewCompensation( tmp ) );

        tmp = {
            compensationName: "Binary Team Bonus",
            description: ""
        };

        list.push(  await CompensationHandler.createNewCompensation( tmp ) );

        tmp = {
            compensationName: "Matching Bonus",
            description: ""
        };

        list.push(  await CompensationHandler.createNewCompensation( tmp ) );

        return list;

    }
}
export default new CompensationTestSuit();