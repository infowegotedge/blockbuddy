'use strict';

let ApiBaseActions    = require('./../../apibase.actions');
let BinaryCalculation = require('./binary.calculation');
let PurcahseConfig    = require('./../model/purchase.json');
let ValidateComponent = require('./../../../component/validate');
// let CoinBaseAPI       = require('./../../../component/coinbase_api');

class CurrentMonthPurchase extends ApiBaseActions {

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
   * Process Request
   */
  processRequest() {
    let that    = this;
    let product = this.app.payment;
    let auth    = this.req.auth;

    product.findCurrentMonthPurchase(auth.credentials.id, (e, r) => {
      if(!e) {
        return that.out(200, {"hasError": false, "payments": (r.length > 0 ? r[0].total : 0)});
      }
      else {
        return that.out(200, {"hasError": true, "message": "No payments found."});
      }
    });
  }
}

module.exports = (request, reply) => {
  let list = new CurrentMonthPurchase(request, reply);
  return list.processRequest();
}
