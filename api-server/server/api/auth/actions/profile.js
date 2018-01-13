'use strict';

let ApiBaseActions = require('./../../apibase.actions');
let jwt = require('jsonwebtoken');

class Profile extends ApiBaseActions {

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
    let payload = this.req.payload;
    let Users   = this.app.users;
    let KYC     = this.app.kyc;
    let auth    = this.req.auth;
    let current = new Date();
    let _s      = this;
    
    // Profile Update
    Users.profileUpdate(payload, auth, KYC, function(e, u) {
      if(e) {
        return _s.out(200, {"hasError": true, "message": u}, e)
      }
      else {
        return _s.out(200, {"hasError": false, "message": "User update"}, null)
      }
    });
  }
}

module.exports = (request, reply) => {
  let profile = new Profile(request, reply);
  return profile.processRequest();
}