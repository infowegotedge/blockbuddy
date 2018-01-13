'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class WithdrawalFeeSum extends ApiBaseActions {

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
    let Withdrawal = this.app.wallet;
    let _s         = this;

    return Withdrawal.findWithdrawalSum((e, ws) => {
      if(e || !ws || ws.length === 0) {
        return _s.out(200, {"hasError": true, "message": "No withdrawal fee found."});
      }

      return _s.out(200, {"hasError": false, "sumFee": ws});
    });
  }
}

module.exports = (request, reply) => {
  let withdrawalFeeSum = new WithdrawalFeeSum(request, reply);
  return withdrawalFeeSum.processRequest();
}