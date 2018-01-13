'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class TransferFeeSum extends ApiBaseActions {

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
    let Transfer = this.app.wallet;
    let _s       = this;

    return Transfer.findTransferSum((e, ts) => {
      if(e || !ts || ts.length === 0) {
        return _s.out(200, {"hasError": true, "message": "No transfers fee found."});
      }

      return _s.out(200, {"hasError": false, "sumFee": ts});
    });
  }
}

module.exports = (request, reply) => {
  let transferFeeSum = new TransferFeeSum(request, reply);
  return transferFeeSum.processRequest();
}