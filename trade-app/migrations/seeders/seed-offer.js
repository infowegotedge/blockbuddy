import OfferController from '../../controllers/offer.controller';

var faker = require("faker");
var moment = require('moment');
var _ = require('lodash');
var randomstring = require("randomstring");

function getRandomCompanyNumber() {
    return _.random(0, 4);
}

function getRandomTraderNumber() {
    return _.random(0, 19);
}

function generateRandomNumber() {
    var min = 0.001,
        max = 3,
        highlightedNumber = (Math.random() * (max - min) + min).toFixed(3);

    return highlightedNumber;
}


async function generateOffer( traderList, companyList ) {
    let re = [];
    let payload = [];
    for( var i = 0 ; i < 70; i++ ){

        payload.tradeUnitPrice= generateRandomNumber();
        payload.tradeTotalAmount= faker.random.number();
        payload.tradeTotalShares= faker.random.number();
        payload.offerType = "BID";
        payload.systemLedgerID = randomstring.generate();
        payload.createdBy = traderList[ getRandomTraderNumber() ].traderID;
        payload.companyCode = companyList[ getRandomCompanyNumber() ].companyCode;
        payload.companyID = companyList[ getRandomCompanyNumber() ].companyID;

        if ( i >= 35 ) {
            payload.offerType = "SELL";
        }

        re.push(
            await OfferController.seedOffer( payload )
        );
    }

    return re;
}




module.exports = generateOffer;