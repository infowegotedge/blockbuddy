'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class DeleteProduct extends ApiBaseActions {

  /**
   * 
   * @param {Request} request 
   * @param {Reply} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  /**
   * 
   * @param {Number} code 
   * @param {Object} data 
   */
  out(code, data) {
    return super.response(code, data);
  }

  /**
   * Process Request
   */
  processRequest() {
    let Products = this.app.payment;
    let payload  = this.req.payload;
    let _s       = this;

    return Products.deleteProduct(payload.id, (e, c) => {
      if(e) {
        return _s.out(200, {"hasError": true, "message": "Product not found."});
      }

      return _s.out(200, {"hasError": false, "message": "Product deleted successfully."});
    });
  }
}

module.exports = (request, reply) => {
  let deleteProduct = new DeleteProduct(request, reply);
  return deleteProduct.processRequest();
}