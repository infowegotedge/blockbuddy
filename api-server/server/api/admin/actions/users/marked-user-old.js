'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class MarkedUserOld extends ApiBaseActions {

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

    return Users.updateUsersByIdsByAdmin(payload.users, (e, u) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "message": "User update successfully"});
      }
      
      return _s.out(200, {"hasError": true, "message": u});
    })
  }
}

module.exports = (request, reply) => {
  let usersUpdate = new MarkedUserOld(request, reply);
  return usersUpdate.processRequest();
}