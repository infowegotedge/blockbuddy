'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class CMSList extends ApiBaseActions {

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
    let CMS     = this.app.cms;
    let query   = this.req.query;
    let curPage = (query.page ? query.page : 1);
    let perPage = (process.env.PAGINATION_LIMIT * 1);
    let _s      = this;

    CMS.list((curPage * 1), (perPage * 1), (e, u) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "cmsContent": u.cmsContent, "totalRows": u.count, "currentPage": (curPage * 1), "perPage": perPage});
      }
      else {
        return _s.out(200, {"hasError": true, "message": "CMS content not found."})
      }
    })
  }
}

module.exports = (request, reply) => {
  let listCMS = new CMSList(request, reply);
  return listCMS.processRequest();
}