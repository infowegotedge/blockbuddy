'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class GetKYC extends ApiBaseActions {

  /**
   * Constructor
   * @param {Request} request 
   * @param {Replay} reply 
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
    let auth    = this.req.auth;
    let kyc     = this.app.kyc;
    let Users   = this.app.users;
    let _s      = this;

    Users.getUser(auth.credentials.id, (e, u) => {
      if(!e && u) {
        // Get KYC
        kyc.getKyc(u.email, function(e, kyc) {
          if(!e) {
            return _s.out(200, {"hasError": false, "kyc": kyc}, null);
          }
          else {
            return _s.out(200, {"hasError": true, "message": c}, e)
          }
        });
      }
      else {
        return _s.out(200, {"hasError": true, "message": "User not found."}, e)
      }
    })
  }
}

module.exports = (request, reply) => {
  let getKYC = new GetKYC(request, reply);
  return getKYC.processRequest();
}
