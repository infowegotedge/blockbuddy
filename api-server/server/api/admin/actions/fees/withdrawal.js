'use strict';

let ApiBaseActions = require('./../../../apibase.actions');
const moment       = require('moment');

class WithdrawalFee extends ApiBaseActions {

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
    let query      = this.req.query;
    let curPage    = (query.page ? query.page : 1);
    let perPage    = (process.env.PAGINATION_LIMIT * 1);
    let filter     = {};
    let _s         = this;

    if(query.from) {
      filter.from = moment(query.from).toISOString();
      filter.upTo = (query.upto ? moment(query.upto).toISOString() : moment().toISOString());
    }

    return Withdrawal.findWalletFee(filter, (curPage * 1), (perPage * 1), (e, a) => {
      if(e || !a || a.length === 0) {
        return _s.out(200, {"hasError": true, "message": "No withdrawal found."});
      }

      return _s.out(200, {"hasError": false, "withdrawals": a.withdrawals, "totalRows": a.count, "currentPage": (curPage * 1), "perPage": perPage, "totalFee": a.totalFee});
    });
  }
}

module.exports = (request, reply) => {
  let withdrawalFee = new WithdrawalFee(request, reply);
  return withdrawalFee.processRequest();
}