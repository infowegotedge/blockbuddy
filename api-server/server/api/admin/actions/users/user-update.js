'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class UsersUpdate extends ApiBaseActions {

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
    let userObj = {};
    let userId  = payload.user_id;
    let _s      = this;
    let auth    = this.req.auth.credentials;

    userObj = {
      "fname": payload.fname,
      "lname": payload.lname,
      "email": payload.email,
      "username": payload.username,
      "password": payload.password,
      "address": payload.address,
      "city": payload.city,
      "state": payload.state,
      "postal": payload.postal,
      "mobile": payload.mobile,
      "country": payload.country,
      "updated_at": (new Date()).toISOString()
    }

    return Users.updateUserByAdmin(userId, userObj, LogData, auth, (e, u) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "message": "User update successfully"});
      }
      
      return _s.out(200, {"hasError": true, "message": u});
    })
  }
}

module.exports = (request, reply) => {
  let usersUpdate = new UsersUpdate(request, reply);
  return usersUpdate.processRequest();
}