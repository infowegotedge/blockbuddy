import TraderController from '../../controllers/trader.controller';

var faker = require("faker");
var moment = require('moment');

async function generateTraderList() {
    var traderList = [];
    let tmp = [];
    for( var i = 1; i < 21 ; i++ ) {
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

        if ( i < 11 ) {
            traderList.push( await TraderController.createPreApprovedTraderProfile( tmp ) );
        } else {
            traderList.push( await TraderController.createTraderProfile( tmp ) );
        }
        
    }

    return traderList;

}



module.exports = generateTraderList;