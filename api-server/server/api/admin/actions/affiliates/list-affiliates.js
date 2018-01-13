'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class ListAffiliates extends ApiBaseActions {

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
    let Affiliates = this.app.affiliates;
    let query      = this.req.query;
    let curPage    = (query.page ? query.page : 1);
    let perPage    = (process.env.PAGINATION_LIMIT * 1);
    let filter     = {'status': 'completed'};
    let _s         = this;

    if(query.status) {
      filter = {'status': query.status};
    }

    return Affiliates.findAffiliationAdmin(filter, (curPage * 1), (perPage * 1), (e, r) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "affiliates": r.affiliates, "totalRows": r.count, "currentPage": (curPage * 1), "perPage": perPage});
      }
      return _s.out(200, {"hasError": true, "message": "Affiliates not found."})
    });
  }
}

module.exports = (request, reply) => {
  let listAffiliates = new ListAffiliates(request, reply);
  return listAffiliates.processRequest();
}