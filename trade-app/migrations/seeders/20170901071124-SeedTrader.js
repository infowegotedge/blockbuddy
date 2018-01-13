var faker = require("faker");
var uuidv4 = require('uuid/v4');
var moment = require('moment');

var _ = require('lodash');


function generateTraderList () {
  var traderList = [];

  for( var i = 1; i < 11 ; i++ ) {
    traderList.push( {
      traderID: uuidv4(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      userName: "test" + i,
      email: faker.internet.email(),
      isActive: true,
      isKycApproved: ( i % 2 ) ? true : false,
      contactNumber: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      country: faker.address.country(),
      locale: faker.random.locale(),
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString()
    });
  }

  return traderList;

}

var traderList = generateTraderList();

function generateCompanyList () {
  var companyList = [];
  for( var i = 1; i < 11 ; i++ ) {
    companyList.push( {
      companyID: uuidv4(),
      companyCode: faker.company.bsAdjective(),
      companyName: faker.company.companyName(),
      companyShortDescription: faker.lorem.paragraph(),
      companyLongDescription: faker.lorem.paragraph(),
      companyAddress: faker.address.streetAddress(),
      companyURL: faker.internet.url(),
      companyEmail: faker.internet.email(),
      companyContactNumber: faker.phone.phoneNumber(),
      companyMeta: {},
      createdBy: traderList[i-1].traderID,
      isApproved: ( i % 2 ) ? true : false,
      isActive: ( i % 2 ) ? true : false,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString()
    });
  }

  return companyList;

}

var companyList = generateCompanyList();



module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Traders', traderList ).then(() => {
      console.log("TRADER LIST-----------------------------");
      console.log( traderList );
      console.log("-----------------------------");
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
