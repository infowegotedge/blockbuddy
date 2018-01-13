'use strict';

let ApiBaseActions      = require('./../../apibase.actions');
let VerifyTwoFactorAuth = require('./../../../component/verify_two_factor');

class DisableTwoFactor extends ApiBaseActions {

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
   * Process GET Request
   */
  doVerifyRequest() {
    let that  = this;
    let auth  = this.req.auth.credentials;
    let Users = this.app.users;
    
    Users.getUser(auth.id, (e, u) => {
      if(!e && u && u.enable_2fa && (u.enable_google || u.enable_authy)) {
        let externalType = (u.enable_google ? 'GOOGLE' : (u.enable_authy ? 'AUTHY' : null));
        let verify2FA    = new VerifyTwoFactorAuth(u.external_id, externalType);
        verify2FA.requestSMS((e, r) => {
          if(!e) {
            return that.out(200, {"hasError": false, "message": r}, null);
          }
          else {
            return that.out(200, {"hasError": true, "message": 'Invalid request'}, e);
          }
        });
      }
      else {
        return that.out(200, {"hasError": true, "message": "Invalid request"}, e);
      }
    });
  }

  /**
   * Process POST Request
   */
  processRequest() {
    let Users   = this.app.users;
    let payload = this.req.payload;
    let that    = this;
    let auth    = this.req.auth.credentials;
    
    Users.getUser(auth.id, (e, u) => {
      if(!e && u && u.enable_2fa && (u.enable_google || u.enable_authy)) {
        let externalType = (u.enable_google ? 'GOOGLE' : (u.enable_authy ? 'AUTHY' : null));
        let verify2FA    = new VerifyTwoFactorAuth(u.external_id, externalType);
        verify2FA.verifyRequest(payload.token, (e, r) => {
          if(!e) {
            return Users.disable2FA(auth.id, (e, u) => {
              if(!e) {
                return that.out(200, {"hasError": false, "message": "Two factor authentication is disabled"}, null) 
              }
              else {
                return that.out(200, {"hasError": true, "message": "Unable to disable two factor authentication. Please try after sometime."}, e) 
              }
            })
          }
          else {
            return that.out(200, {"hasError": true, "message": "Invalid two factor token. Request is cancelled."}, e) 
          }
        });
      }
      else {
        return that.out(200, {"hasError": true, "message": "Invalid request"}, e);
      }
    });
  }
}

module.exports = (request, reply) => {
  let disableTwoFactor = new DisableTwoFactor(request, reply);

  if(request.method == 'post') {
    return disableTwoFactor.processRequest();
  }
  
  return disableTwoFactor.doVerifyRequest();
}