import TraderQualification from '../transaction/trader-qualification';

var faker = require("faker");

var moment = require('moment');

class TraderTestSuit {
    
    createTraders = async () => {

        var traderList = [];
        let tmp = [];
        for( var i = 1; i < 50 ; i++ ) {
            tmp = {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                userName: "test" + i,
                email: faker.internet.email(),
                contactNumber: faker.phone.phoneNumber(),
                address: faker.address.streetAddress(),
                country: faker.address.country(),
                locale: faker.random.locale()
            };
            
            traderList.push( await TraderQualification.registerNewTrader( tmp ) );
        }

        return traderList;

    }
}
export default new TraderTestSuit();