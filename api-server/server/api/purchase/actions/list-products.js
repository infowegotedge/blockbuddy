'use strict';

let ApiBaseActions    = require('./../../apibase.actions');
let BinaryCalculation = require('./binary.calculation');
let PurcahseConfig    = require('./../model/purchase.json');
let ValidateComponent = require('./../../../component/validate');
// let CoinBaseAPI       = require('./../../../component/coinbase_api');

class ProductsListAll extends ApiBaseActions {

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

    product.listProductPurchase((e, r) => {
      if(!e) {
        return that.out(200, {"hasError": false, "products": r});
      }
      else {
        return that.out(200, {"hasError": true, "message": "No products found."});
      }
    });
  }
}

module.exports = (request, reply) => {
  let list = new ProductsListAll(request, reply);
  return list.processRequest();
}
