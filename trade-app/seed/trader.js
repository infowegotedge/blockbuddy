import TraderQualification from '../transaction/trader-qualification';

import TraderHandler from '../handler/trader.handler';

var faker = require("faker");

var moment = require('moment');

class TraderTestSuit {
    
    createTraders = async () => {

        var traderList = [];
        let tmp = [];

        // for( var i = 1; i < 20 ; i++ ) {
        //     tmp = {
        //         firstName: faker.name.firstName(),
        //         lastName: faker.name.lastName(),
        //         userName: "test" + i,
        //         email: faker.internet.email(),
        //         contactNumber: faker.phone.phoneNumber(),
        //         address: faker.address.streetAddress(),
        //         country: faker.address.country(),
        //         locale: faker.random.locale()
        //     };
        //
        //     traderList.push( await TraderQualification.registerNewTrader( tmp ) );
        // }



        tmp = {
            firstName: "ANSHUL",
            lastName: "GARG",
            userName: "anshul_garg",
            email: "anshul_171186@yahoo.co.in",
            contactNumber: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );

        tmp = {
            firstName: "ANDREAS",
            lastName: "SJSTEDT",
            userName: "andreas_sjstedt",
            email: "tastyandy96@hotmail.com",
            contactNumber: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );
        
        tmp = {
            firstName: "MATTHEW",
            lastName: "CONNELLY",
            userName: "matthewconnelly",
            email: "adminofficejobs@gmail.com",
            contactNumber: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );
 
        tmp = {
            firstName: "MATT",
            lastName: "CONNELLY",
            userName: "matt_connelly",
            email: "matt@matt-connelly.com",
            contactNumber: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );

        tmp = {
            firstName: "BOSTJAN",
            lastName: "NEMES",
            userName: "bostjannemes",
            email: "bostjannemes@gmail.com",
            contactNumber: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );


        tmp = {
            firstName: "WINTER",
            lastName: "GILLMAN",
            userName: "winter_gillman",
            email: "wintergillman2004@gmail.com",
            contactNumber: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );
        
        
        tmp = {
            firstName: "DENIS",
            lastName: "LORENTS",
            userName: "den lorents",
            email: "dykaandden@gmail.com",
            contactNumber: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );

        tmp = {
            firstName: "EX",
            lastName: "US",
            userName: "example",
            email: "exampleuser@gmail.com",
            contactNumber: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );
        
        tmp = {
            firstName: "ANKUR",
            lastName: "GARG",
            userName: "ankur",
            email: "ankur.garg1311@gmail.com",
            contactNumber: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );
 
        tmp = {
            firstName: "Mohammad",
            lastName: "Faiz",
            userName: "ziafmohammad",
            email: "faiz@allies.co.in",
            contactNumber: "9125055545",
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );

        tmp = {
            firstName: "Addison",
            lastName: "Matthews",
            userName: "hunter",
            email: "addison.matthews64@pl.p",
            contactNumber: "6158856604",
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );

        tmp = {
            firstName: "Carl",
            lastName: "Torres",
            userName: "forest",
            email: "carl.torres90@pl.p",
            contactNumber: "9101798789",
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );

        tmp = {
            firstName: "deannah",
            lastName: "kuhn",
            userName: "aries",
            email: "deanna.kuhn95@pl.p",
            contactNumber: "54616191864",
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );

        tmp = {
            firstName: "Ashley",
            lastName: "Arnold",
            userName: "manager",
            email: "ashley.arnold36@gmail.com",
            contactNumber: "361522934",
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );

        tmp = {
            firstName: "leslie",
            lastName: "rodriquez",
            userName: "dogwoodave",
            email: "leslie.rodriquez19@pl.p",
            contactNumber: "8646168614",
            address: faker.address.streetAddress(),
            country: "Sweden",
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );

        tmp = {
            firstName: "Bernice",
            lastName: "Ramirez",
            userName: "westheimer",
            email: "bernice.ramirez48@pl.p",
            contactNumber: "689161114545",
            address: faker.address.streetAddress(),
            country: "Sweden",
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );

        tmp = {
            firstName: "Shivani",
            lastName: "Pandey",
            userName: "shivani",
            email: "shivani@allies.co.in",
            contactNumber: "9044990022",
            address: faker.address.streetAddress(),
            country: "Sweden",
            locale: faker.random.locale()
        };

        traderList.push( await TraderQualification.registerNewTrader( tmp ) );

        return traderList;

    }

    createAdmin = async () => {
        let tmp = {
            firstName: "BB",
            lastName: "App",
            userName: "bbcorp",
            email: "bbcorp@gmail.com",
            contactNumber: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            country: faker.address.country(),
            locale: faker.random.locale()
        };
        return await TraderHandler.createAdminProfile( tmp );
    }
}
export default new TraderTestSuit();