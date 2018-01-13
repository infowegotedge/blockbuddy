'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class UpdateKYC extends ApiBaseActions {

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
    let payload = this.req.payload;
    let users   = auth.credentials;
    let time    = (new Date()).toISOString();
    let colorStatus = 'N';
    let kycFlag = 'PENDING';

    // Data
    let updateData = {
      "admin": { "flag": 'UNVERIFIED', "rejectReason" : "", "comments" : "", "timestamp" : time, "viewed" : false, "name" : "", "id" : "" },
      "moderator": { "rejectReason" : "", "viewed" : false, "comments" : "", "timestamp" : time, "flag" : "UNVERIFIED", "name" : "", "id" : "" },
      "kyc_flag": kycFlag,
      "user": { "govid": payload.governmentId, "taxid": payload.taxId, "email" : users.email, "name" : users.name, "id" : users.id },
      "s3asset": { "id_1": payload.taxPhotoId, "selfie": payload.photoId },
      "assetsStatus": { "selfie": 'UNVERIFIED', "id_1": 'UNVERIFIED' },
      "color_status": colorStatus
    }

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

    kyc.getKycByKycId(payload.id, (e, kyc1) => {
      if(!e && kyc1) {
        updateData.user = kyc1.user;
        updateData.user["govid"] = payload.governmentId;
        updateData.user["taxid"] = payload.taxId;

        Users.getUser(kyc1.user.id, (e, u) => {
          updateData.user['mobile'] = (!e && u && u.mobile ? u.mobile : '');
          
          // Kyc Updates
          kyc.updateKYC(payload.id, updateData, function(e, kyc) {
            if(!e) {
              return _s.out(200, {"hasError": false, "message": 'KYC updated successfully.'}, null);
            }
            else {
              return _s.out(200, {"hasError": true, "message": c}, e)
            }
          });
        })
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Kyc not found"}, e)
      }
    });
  }
}

module.exports = (request, reply) => {
  let kycUpdate = new UpdateKYC(request, reply);
  return kycUpdate.processRequest();
}
