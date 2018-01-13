'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class UsersBlocker extends ApiBaseActions {

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
    let LogData = this.app.logdata;
    let payload = this.req.payload;
    let auth    = this.req.auth.credentials;
    let _s      = this;

    Users.updateBlocker(payload.user_id, payload.block_user, LogData, auth, (e, u) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "message": "Updated user"});
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Users not updated."})
      }
    })
  }
}

module.exports = (request, reply) => {
  let usersBlocker = new UsersBlocker(request, reply);
  return usersBlocker.processRequest();
}