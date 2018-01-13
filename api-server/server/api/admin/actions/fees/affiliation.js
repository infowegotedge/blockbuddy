'use strict';

let ApiBaseActions = require('./../../../apibase.actions');
const moment       = require('moment');

class AffiliationFees extends ApiBaseActions {

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
    let Affiliation = this.app.affiliates;
    let query       = this.req.query;
    let curPage     = (query.page ? query.page : 1);
    let perPage     = (process.env.PAGINATION_LIMIT * 1);
    let filter      = {};
    let _s          = this;

    if(query.from) {
      filter.from = moment(query.from).toISOString();
      filter.upTo = (query.upto ? moment(query.upto).toISOString() : moment().toISOString());
    }

    return Affiliation.findAffiliation(filter, (curPage * 1), (perPage * 1), (e, a) => {
      if(e || !a || a.length === 0) {
        return _s.out(200, {"hasError": true, "message": "No affiliations found."});
      }

      return _s.out(200, {"hasError": false, "affiliations": a.affiliates, "totalRows": a.count, "currentPage": (curPage * 1), "perPage": perPage});
    });
  }
}

module.exports = (request, reply) => {
  let affiliationFees = new AffiliationFees(request, reply);
  return affiliationFees.processRequest();
}