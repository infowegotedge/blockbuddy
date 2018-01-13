'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class UsersList extends ApiBaseActions {

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
    let Users   = this.app.users;
    let query   = this.req.query;
    let curPage = (query.page ? query.page : 1);
    let perPage = (process.env.PAGINATION_LIMIT * 1);
    let filter  = null;
    let _s      = this;

    if(query.filter) {
      filter = query.filter;
    }

    Users.listUsers(filter, (curPage * 1), (perPage * 1), (e, u) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "users": u.users, "totalRows": u.count, "currentPage": (curPage * 1), "perPage": perPage});
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Users not found."})
      }
    })
  }
}

module.exports = (request, reply) => {
  let usersList = new UsersList(request, reply);
  return usersList.processRequest();
}