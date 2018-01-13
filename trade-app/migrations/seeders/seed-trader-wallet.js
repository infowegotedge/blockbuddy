import TraderWalletController from '../../controllers/trader-wallet.controller';

var faker = require("faker");
var moment = require('moment');
var _ = require('lodash');

async function generateTraderWallet( traderList ) {
    let re = [];
    for( var i = 0 ; i < traderList.length ; i++ ){
        re.push( await TraderWalletController.createTraderWallet( traderList[i].traderID, parseInt(faker.random.number()) ) );    
    }
    return re;
}




module.exports = generateTraderWallet;