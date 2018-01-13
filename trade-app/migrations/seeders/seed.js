process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('babel-register');

// Load environment variables
require('dotenv').config();

var generateAdmin = require('./seed-admin');
var generateTraders = require('./seed-traders');
var generateCompany = require('./seed-company');
var generateStockReport = require('./seed-stock-data');
var generateTraderWallet = require('./seed-trader-wallet');
var generateOffer = require('./seed-offer');

//Database Seed
async function seed() {
    console.log( "================= Database Seeding in progress ==============" );

    console.log( "----------------- ADMIN CREATION ---------------" );
    let admin = await generateAdmin();
    console.log( ">>>>>", admin );
    console.log( "----------------- END of ADMIN CREATION ---------------" );

    console.log( "----------------- Trader List ---------------" );
    let traderList = await generateTraders();
    console.log( ">>>>>", traderList );
    console.log( "----------------- END of Trader List ---------------" );

    console.log( "----------------- Company List ---------------" );
    let companyList = await generateCompany( traderList );
    console.log( ">>>>>", companyList );
    console.log( "----------------- END Of Company List ---------------" );

    console.log( "----------------- Stock Report List ---------------" );
    await generateStockReport( companyList );
    console.log( "----------------- END Of Stock Report List ---------------" );

    console.log( "----------------- TraderWallet List ---------------" );
    console.log(">>>>", await generateTraderWallet( traderList ) );
    console.log( "----------------- END Of TraderWallet List ---------------" );
    
    console.log( "----------------- Offer List ---------------" );
    console.log(">>>>", await generateOffer( traderList, companyList ) );
    console.log( "----------------- END Of Offer List ---------------" );

    console.log( "================= Database Seeding ended ==============" );
}

seed();