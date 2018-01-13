'use strict';

let ApiBaseActions = require('./../../../apibase.actions');
const moment       = require('moment');

class CreateCurrency extends ApiBaseActions {

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
    let Currency = this.app.currencycoins;
    let payload  = this.req.payload;
    let _s       = this;

    return Currency.createCurrency(payload, (e, a) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "message": "Currency created successfully."});
      }

      return _s.out(200, {"hasError": true, "message": "Currency not created."});
    });
  }
}

module.exports = (request, reply) => {
  let createCurrency = new CreateCurrency(request, reply);
  return createCurrency.processRequest();
}