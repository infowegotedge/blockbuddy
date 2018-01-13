import CompanyController from '../../controllers/company.controller';

import CompanyLaunchTransaction from '../../transaction/company-launch';

var faker = require("faker");
var moment = require('moment');
var _ = require('lodash');

async function generateCompanyList( listTraders ) {
    var companyList = [];
    let tmp = [], newCompany = '';

    for( var i = 1; i < 11 ; i++ ) {
        tmp = {
            companyCode: faker.random.alphaNumeric() + faker.random.alphaNumeric() + faker.random.alphaNumeric() + faker.random.alphaNumeric() + faker.random.alphaNumeric(),
            companyName: faker.company.companyName(),
            companyShortDescription: faker.lorem.paragraph(),
            companyLongDescription: faker.lorem.paragraph(),
            companyAddress: faker.address.streetAddress(),
            companyURL: faker.internet.url(),
            companyEmail: faker.internet.email(),
            companyContactNumber: faker.phone.phoneNumber(),
            initialShareOffering: faker.random.number(),
            companyMeta: null
        };

        newCompany = await CompanyController.createCompany( listTraders[i-1].traderID, tmp );

        if ( i < 6 ) {
            await CompanyLaunchTransaction.approveCompanyAndSharesToCompanyOwnerAccount( tmp.companyCode )
        }
        
        companyList.push( newCompany );
    }

    //Approve those companies
    return companyList;

}



module.exports = generateCompanyList;