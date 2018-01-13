'use strict';

let ApiBaseActions    = require('./../../apibase.actions');
let BinaryCalculation = require('./binary.calculation');
let PurcahseConfig    = require('./../model/purchase.json');
let ValidateComponent = require('./../../../component/validate');
// let CoinBaseAPI       = require('./../../../component/coinbase_api');

class ProductsCreate extends ApiBaseActions {

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
    let that           = this;
    let product        = this.app.payment;
    let payload        = this.req.payload;
    let auth           = this.req.auth;

    product.createProduct(payload, auth.credentials.id, (e, r) => {
      if(!e) {
        return that.out(200, {"hasError": false, "message": "Product created successfully."});
      }
      else {
        return that.out(200, {"hasError": true, "message": e});
      }
    });
  }
}

module.exports = (request, reply) => {
  let creator = new ProductsCreate(request, reply);
  return creator.processRequest();
}
