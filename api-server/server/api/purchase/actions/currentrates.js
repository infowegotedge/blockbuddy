'use strict';

let ApiBaseActions = require('./../../apibase.actions');
let PurchaseRates  = require('./../model/purchase.json');

class CurrentRates extends ApiBaseActions {

  /**
   * Constructor
   * @param {Request} request 
   * @param {Reply} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  /**
   * Output Generator
   * @param {Number} code 
   * @param {Object} data 
   * @param {Error} error 
   */
  out(code, data, error) {
    if(error) {
      super.logger.logError(error);
    }

    if(data.hasError) {
      super.logger.logWarning(data.message);
    }

    return super.response(code, data);
  }

  /**
   * Process GET Request
   */
  processGetRequest() {
    let that         = this;
    let currentRates = this.app.purchase;
    let Rates        = this.app.rates;
    
    currentRates.findCurrentRates(function(e, cr) {
      if(e) {
        return that.out(200, {"hasError": true, "message": cr}, e)
      }
      else {
        Rates.getRates(function(er, r) {
          if(!er) {
            let rate    = PurchaseRates.powerRate;
            let pool    = that.__rates((rate.pool.letPrice * 1), (r ? (r.rates * 1) : 0));
            let machine = that.__rates((rate.machine.letPrice * 1), (r ? (r.rates * 1) : 0));
            let rack    = that.__rates((rate.rack.letPrice * 1), (r ? (r.rates * 1) : 0));
            let curRate = {
              "price_btc": ((pool.btcRates + machine.btcRates + rack.btcRates) / 3),
              "price_usd": ((pool.usdRates + machine.usdRates + rack.usdRates) / 3),
            };

            return that.out(200, {"hasError": false, "unit": (cr ? cr.unit : ''), "currentRates": curRate, "pool": pool, "machine": machine, "rack": rack}, null);
          }
          else {
            return that.out(200, {"hasError": true, "message": 'Rates not found'}, er)
          }
        });
      }
    });
  }

  /**
   * Process POST Request
   */
  processRequest() {
    let that         = this;
    let currentRates = this.app.purchase;
    let payload      = this.req.payload;

    currentRates.saveCurrentRates(payload, function(e, c) {
      if(e) {
        return that.out(200, {"hasError": true, "message": c}, e)
      }
      else {
        return that.out(200, {"hasError": false, "message": "Save successfully"}, null)
      }
    });
  }

  /**
   * Get Rates
   * @param {Number} price
   * @param {Number} actualPrice
   */
  __rates(price, actualPrice) {
    let amountUSD = (actualPrice * price);
    let amountBTC = price;
    return {
      "btcRates": (amountBTC / 1000000),
      "usdRates": (amountUSD / 1000000)
    }
  }
}

module.exports = (request, reply) => {
  let currentRates = new CurrentRates(request, reply);
  if(request.method === 'post') {
    return currentRates.processRequest();
  }

  return currentRates.processGetRequest();
}
