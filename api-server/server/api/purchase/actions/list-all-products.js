'use strict';

let ApiBaseActions    = require('./../../apibase.actions');
let BinaryCalculation = require('./binary.calculation');
let PurcahseConfig    = require('./../model/purchase.json');
let ValidateComponent = require('./../../../component/validate');
// let CoinBaseAPI       = require('./../../../component/coinbase_api');

class ProductsList extends ApiBaseActions {

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
    let query   = this.req.query;
    let auth    = this.req.auth;
    let perPage = (process.env.PAGINATION_LIMIT * 1);
    let curPage = (query.page ? query.page : 1);

    product.listProduct((curPage * 1), perPage, (e, r) => {
      if(!e) {
        return that.out(200, {"hasError": false, "products": r.products, "totalRows": r.count, "currentPage": (curPage * 1), "perPage": perPage});
      }
      else {
        return that.out(200, {"hasError": true, "message": "No products found."});
      }
    });
  }
}

module.exports = (request, reply) => {
  let list = new ProductsList(request, reply);
  return list.processRequest();
}
