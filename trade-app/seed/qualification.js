import QualificationHandler from '../handler/qualification.handler';

var faker = require("faker");

var moment = require('moment');

class QualificationTestSuit {
    
    createQualification = async () => {

        var list = [];
        let tmp = {
            qualificationName: "Free",
            qualificationCode: "FREE",
            description: faker.lorem.text(),
            constraints: {}
        };

        list.push( await QualificationHandler.createNewQualification( tmp ) );

        tmp = {
            qualificationName: "Marketing Partner",
            qualificationCode: "MARKETING-PARTNER",
            description: "",
            constraints: {}
        };

        list.push( await QualificationHandler.createNewQualification( tmp ) );

        tmp = {
            qualificationName: "Pearl",
            qualificationCode: "PEARL",
            constraints: {test: "1231"}
        };

        list.push( await QualificationHandler.createNewQualification( tmp ) );

        tmp = {
            qualificationName: "Sapphire",
            qualificationCode: "SAPPHIRE",
            description: faker.lorem.text(),
            constraints: faker.helpers.createTransaction()
        };

        list.push( await QualificationHandler.createNewQualification( tmp ) );

        tmp = {
            qualificationName: "Ambassador Diamond",
            qualificationCode: "AMBASSADAR-DIAMOND",
            description: faker.lorem.text(),
            constraints: faker.helpers.createTransaction()
        };

        list.push( await QualificationHandler.createNewQualification( tmp ) );


        tmp = {
            qualificationName: "Crown Diamond",
            qualificationCode: "CROWN-DIAMOND",
            description: faker.lorem.text(),
            constraints: faker.helpers.createTransaction()
        };

        list.push( await QualificationHandler.createNewQualification( tmp ) );



        return list;

    }
}
export default new QualificationTestSuit();