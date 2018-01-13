'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class ListCommission extends ApiBaseActions {

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
    let Commission = this.app.binaryCommission;
    let query      = this.req.query;
    let curPage    = (query.page ? query.page : 1);
    let perPage    = (process.env.PAGINATION_LIMIT * 1);
    let _s         = this;

    return Commission.findCommission((curPage * 1), (perPage * 1), (e, c) => {
      if(e || !c || c.length === 0) {
        return _s.out(200, {"hasError": true, "message": "No commission found."});
      }

      return _s.out(200, {"hasError": false, "commissions": c.commissions, "totalRows": c.count, "currentPage": curPage, "perPage": perPage});
    });
  }
}

module.exports = (request, reply) => {
  let listCommission = new ListCommission(request, reply);
  return listCommission.processRequest();
}