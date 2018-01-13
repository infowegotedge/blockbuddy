'use strict';

let ApiBaseActions    = require('./../../apibase.actions');
let BinaryCalculation = require('./binary.calculation');
let PurcahseConfig    = require('./../model/purchase.json');
let ValidateComponent = require('./../../../component/validate');
// let CoinBaseAPI       = require('./../../../component/coinbase_api');

class PruchaseOrder extends ApiBaseActions {

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
    let Payment = this.app.payment;
    let Ledger  = this.app.ledger;
    let auth    = this.req.auth.credentials;
    let payload = this.req.payload;

    Payment.getPaymentsByOderId(payload.order_id, (e, r) => {
      if(!e) {
        return that.out(200, {"hasError": false, "payment": {
          orderId: r.order_id,
          amount: r.amount,
          productName: r.product_name,
          updatedAt: r.updated_at
        }});
      }
      else {
        return that.out(200, {"hasError": true, "message": "No products found."});
      }
    });
  }
}

module.exports = (request, reply) => {
  let pruchaseOrder = new PruchaseOrder(request, reply);
  return pruchaseOrder.processRequest();
}
