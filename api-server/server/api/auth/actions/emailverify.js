'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class EmailVerification extends ApiBaseActions {

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
    let Users   = this.app.users;
    let payload = this.req.payload;
    let _s      = this;

    Users.findUserByToken(payload.verify_token, function(e, v) {
      if(!e && v) {
        Users.updateAddress(v.userid, {"verify_email": true}, function(e, u) {
          if(!e) {
            v.remove(function(ev, rv) {
              return _s.out(200, {"hasError": false, "message": "Email Verified"}, null);
            });
          }
          else {
            return _s.out(200, {"hasError": true, "message": "Invalid Email Verify Token."}, e);
          }
        });
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Invalid Email Verify Token."}, e);
      }
    });
  }
}

module.exports = (request, reply) => {
  let emailVerification = new EmailVerification(request, reply);
  return emailVerification.processRequest();
}
