'use strict';

let ApiBaseActions = require('./../../apibase.actions');
let jwt = require('jsonwebtoken');

class UserTransferVerify extends ApiBaseActions {

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
    let headers  = this.req.auth.credentials;
    let Users    = this.app.users;
    let payload  = this.req.payload;
    let _s       = this;
    
    // Find User
    Users.query(headers, function(e, u) {
      if(!e && !u) {
        return _s.out(200, {"hasError": true, "message": "Invalid token"}, e);
      }
      else {
        // Get User
        Users.findNameByUsername(payload.username, function(es, s) {
          if(!es && s) {
            return _s.out(200, {
              "hasError": false,
              "user": s
            }, null);
          }
          else {
            return _s.out(200, {"hasError": true, "message": "User not found."});
          }
        });
      }
    });
  }
}

module.exports = (request, reply) => {
  let creator = new UserTransferVerify(request, reply);
  return creator.processRequest();
}
