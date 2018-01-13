'use strict';

let ApiBaseActions = require('./../../../apibase.actions');
const moment       = require('moment');

class CommissionFees extends ApiBaseActions {

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
    let Commission  = this.app.ledger;
    let query       = this.req.query;
    let curPage     = (query.page ? query.page : 1);
    let perPage     = (process.env.PAGINATION_LIMIT * 1);
    let filter      = {};
    let _s          = this;
    let auth        = this.req.auth.credentials;

    if(query.from) {
      filter.from = moment(query.from).toISOString();
      filter.upTo = (query.upto ? moment(query.upto).toISOString() : moment().toISOString());
    }

    return Commission.findAdminCommission(auth.id, filter, (curPage * 1), (perPage * 1), (e, a) => {
      if(e || !a || a.length === 0) {
        return _s.out(200, {"hasError": true, "message": "No affiliations found."});
      }

      return _s.out(200, {"hasError": false, "commissions": a.rows, "totalRows": a.count, "currentPage": (curPage * 1), "perPage": perPage, "totalCommission": a.totalCommission});
    });
  }
}

module.exports = (request, reply) => {
  let commissionFees = new CommissionFees(request, reply);
  return commissionFees.processRequest();
}