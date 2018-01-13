'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class UsersSearch extends ApiBaseActions {

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
    let payload = this.req.payload;
    let _s      = this;

    Users.findUser(payload.search, (e, u) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "users": u});
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Users not found."})
      }
    });
  }
}

module.exports = (request, reply) => {
  let usersSearch = new UsersSearch(request, reply);
  return usersSearch.processRequest();
}