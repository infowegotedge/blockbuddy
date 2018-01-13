'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class UserRoles extends ApiBaseActions {

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

    console.log(payload);
    Users.setRoles(payload, (e, u) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "message": "Role saved successfully."});
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Unable to save roles."})
      }
    })
  }
}

module.exports = (request, reply) => {
  let userRoles = new UserRoles(request, reply);
  return userRoles.processRequest();
}