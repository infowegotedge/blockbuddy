'use strict';

// const crypt = require('crypto')

class CurrencyCoinsModel {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // Currency Schema Definition
    let currencySchema = new Schema({
      currency: { type: String },
      currency_code: { type: String },
      created_at: { type: Date, "default": Date.now },
      updated_at: { type: Date },
      active: { type: Boolean },
      enable_disable: { type: Boolean }
    });

    // Coins Schema Definition
    let coinSchema = new Schema({
      coin_name: { type: String },
      coin_currency_code: { type: String },
      coin_value: { type: String },
      created_at: { type: Date, "default": Date.now },
      updated_at: { type: Date },
      active: { type: Boolean },
      enable_disable: { type: Boolean }
    });

    // Currency Schema
    currencySchema.index({currency_code:1, created_at:1})
    this.Currency = connection.model('Currency', currencySchema);

    // Coins Schema
    coinSchema.index({coin_code:1, created_at:1})
    this.Coins = connection.model('Coins', coinSchema);
  }

  createCurrency(newValue, cb) {
    let time = (new Date()).toISOString();
    let currencyData = {
      currency: newValue.currency,
      currency_code: newValue.code,
      created_at: time,
      updated_at: time,
      active: true
    };

    let currency = new this.Currency(currencyData);
    currency.save(cb);
  }

  createCoin(newValue, cb) {
    let time = (new Date()).toISOString();
    let coinData = {
      coin_name: newValue.coinName,
      coin_currency_code: newValue.coinCode,
      coin_value: newValue.coinValue,
      created_at: time,
      updated_at: time,
      active: true
    };

    if(newValue.coinValue > 0) {
      let coin = new this.Coins(newValue);
      return coin.save(cb);
    }
    else {
      return cb(true, "Coin value must be greater then zero.");
    }
  }
}

module.exports = CurrencyCoinsModel;
module.exports.getName = () => {
  return 'currencycoins';
}