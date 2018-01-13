'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class KYCCreate extends ApiBaseActions {

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
    let payload = this.req.payload;
    let kyc     = this.app.kyc;
    let Users   = this.app.users;
    let _s      = this;

    if(!payload.photoId || payload.photoId === '') {
      return _s.out(200, {"hasError": true, "message": "Please upload government photo ID."})
    }

    if(!payload.taxPhotoId || payload.taxPhotoId === '') {
      return _s.out(200, {"hasError": true, "message": "Please upload tax photo ID."})
    }

    if(!payload.governmentId || payload.governmentId === '') {
      return _s.out(200, {"hasError": true, "message": "Please provide your government ID."})
    }

    if(!payload.taxId || payload.taxId === '') {
      return _s.out(200, {"hasError": true, "message": "Please provide your tax ID."})
    }

    Users.getUser(auth.credentials.id, (e, user) => {
      if(!e || user) {
        kyc.create(payload, user, auth.credentials.id, (e, kycUser) => {
          if(!e) {
            return _s.out(200, {"hasError": false, "message": "KYC created successfully."})
          }
          else {
            return _s.out(200, {"hasError": true, "message": kycUser});
          }
        });
      }
      else {
        return _s.out(200, {"hasError": true, "message": "User not found."});
      }
    });
  }
}

module.exports = (request, reply) => {
  let kycCreate = new KYCCreate(request, reply);
  return kycCreate.processRequest();
}
