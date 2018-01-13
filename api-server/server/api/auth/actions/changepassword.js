'use strict';

let ApiBaseActions = require('./../../apibase.actions');
let jwt = require('jsonwebtoken');

class ChangePassword extends ApiBaseActions {

  /**
   * Constructor 
   * @param {Request} request
   * @param {Reply} reply
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  /**
   * Generate Output
   * @param {Number} code 
   * @param {Object} data 
   * @param {Error} error 
   */
  out(code, data, error) {
    if(error) {
      super.logger.logError(error);
    }

    if(data.hasError) {
      super.logger.logWarning(data.message);
    }

    return super.response(code, data);
  }

  /**
   * Process Request
   */
  processRequest() {
    let headers = this.req.auth.credentials;
    let Users   = this.app.users;
    let payload = this.req.payload;
    let _s      = this;

    Users.query(headers, function(e, u) {
      if(!e && !u) {
        return _s.out(200, {"hasError": true, "message": "Invalid token"}, null);
      }
      else {
        Users.changePassword(payload, u, function(_e, _u) {
          if(_e) {
            return _s.out(200, {"hasError": true, "message": _u}, _e);
          }
          else {
            return _s.out(200, {"hasError": false, "message": "Change Password"}, null)
          }
        })
      }
    });
  }
}

module.exports = (request, reply) => {
  let changePassword = new ChangePassword(request, reply);
  return changePassword.processRequest();
}