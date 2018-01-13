'use strict';

let ApiBaseActions = require('./../../../apibase.actions');
const moment       = require('moment');

class CreateCoins extends ApiBaseActions {

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
    let Coins   = this.app.currencycoins;
    let payload = this.req.payload;
    let _s      = this;

    return Coins.createCoin(payload, (e, a) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "message": "Coins created successfully."});
      }

      return _s.out(200, {"hasError": true, "message": "Coins not created."});
    });
  }
}

module.exports = (request, reply) => {
  let createCoins = new CreateCoins(request, reply);
  return createCoins.processRequest();
}