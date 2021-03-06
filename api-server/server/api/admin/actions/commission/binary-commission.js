'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class BinaryCommission extends ApiBaseActions {

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
   * @param {Data} data 
   */
  out(code, data) {
    return super.response(code, data);
  }

  /**
   * Process Request
   */
  processRequest() {
    let Users      = this.app.users;
    let Commission = this.app.binaryCommission;
    let query      = this.req.query;
    let curPage    = (query.page ? query.page : 1);
    let perPage    = (process.env.PAGINATION_LIMIT * 1);
    let _s         = this;

    return Users.findUserByUsername('bbcorp', (e, u) => {
      if(!e && u) {
        return Commission.findBinaryCommission(u._id+'', (curPage * 1), (perPage * 1), (e, c) => {
          if(e || !c || c.length === 0) {
            return _s.out(200, {"hasError": true, "message": "No binary commission found."});
          }

          return _s.out(200, {"hasError": false, "commissions": c.commissions, "totalRows": c.count, "currentPage": curPage, "perPage": perPage});
        });
      }
      else {
        return _s.out(200, {"hasError": true, "message": "No binary commission found."});
      }
    });
  }
}

module.exports = (request, reply) => {
  let binaryCommission = new BinaryCommission(request, reply);
  return binaryCommission.processRequest();
}