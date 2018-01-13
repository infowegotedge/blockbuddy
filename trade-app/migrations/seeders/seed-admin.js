import TraderController from '../../controllers/trader.controller';

var faker = require("faker");
var moment = require('moment');

async function generateAdminUser() {
    let tmp = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: "bbapp",
        email: faker.internet.email(),
        contactNumber: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        country: faker.address.country(),
        locale: faker.random.locale()
    };

    return await TraderController.createAdminProfile( tmp );

}



module.exports = generateAdminUser;