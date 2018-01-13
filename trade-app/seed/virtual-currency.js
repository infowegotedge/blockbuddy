import CurrencyHandler from '../handler/currency.handler';

var faker = require("faker");

var moment = require('moment');

class VirtualCurrencyTestSuit {

    createVirtualCurrency = async () => {

        var list = [];
        let tmp = {
            currencyCode: "BKN",
            currencyName: "Block Notes",
            description: ""
        };

        list.push( await CurrencyHandler.createNewCurrency( tmp ) );

        tmp = {
            currencyCode: "EURO",
            currencyName: "Euro",
            description: ""
        };

        list.push( await CurrencyHandler.createNewCurrency( tmp ) );

        tmp = {
            currencyCode: "BV",
            currencyName: "Business Volume",
            description: ""
        };

        list.push( await CurrencyHandler.createNewCurrency( tmp ) );

        return list;

    }
}
export default new VirtualCurrencyTestSuit();