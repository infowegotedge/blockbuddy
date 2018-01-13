'use strict';

let ApiBaseActions    = require('./../../apibase.actions');
let BinaryCalculation = require('./binary.calculation');
let PurcahseConfig    = require('./../model/purchase.json');
let ValidateComponent = require('./../../../component/validate');
// let CoinBaseAPI       = require('./../../../component/coinbase_api');

class ProductsPurchase extends ApiBaseActions {

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
    let Ledger  = this.app.ledger;
    let auth    = this.req.auth.credentials;

    product.listProductPurchase((e, r) => {
      if(!e) {
        let rows = r.length;
        let ids  = [];
        for(let idx = 0; idx < rows; idx++) {
          ids.push(r[idx]._id + '');
        }

        Ledger.productAllBalance(auth.id, (et, total) => {
          if(!et) {
            let rows = r.length;
            let totalProduct = [];

            for(let idx = 0; idx < rows; idx++) {
              let product = that.filterById(total, r[idx]._id)
              totalProduct.push({
                "name": r[idx].name,
                "totalPurchase": ((product && product[0]) ? product[0].total : 0)
              });
            }

            return that.out(200, {"hasError": false, "products": totalProduct});
          }
          else {
            return that.out(200, {"hasError": false, "products": r});
          }
        });
      }
      else {
        return that.out(200, {"hasError": true, "message": "No products found."});
      }
    });
  }
}

module.exports = (request, reply) => {
  let productsPurchase = new ProductsPurchase(request, reply);
  return productsPurchase.processRequest();
}
