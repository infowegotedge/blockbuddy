'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class KYCUpdate extends ApiBaseActions {

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
    let auth      = this.req.auth;
    let kyc       = this.app.kyc;
    let Users     = this.app.users;
    let LogData   = this.app.logdata;
    let _s        = this;
    let payload   = this.req.payload;
    let users     = auth.credentials;
    let kyc_flag  = '';
    let colorStatus = 'N';
    let moderator = {
      "rejectReason": payload.moderatorUserComments,
      "comments": payload.moderatorComments,
      "viewed": true,
      "flag": payload.moderatorStatus,
      "name": "...",
      "id": "...",
    };
    let admin = {
      "rejectReason": payload.adminUserComments,
      "comments": payload.adminComments,
      "viewed": true,
      "flag": payload.adminStatus,
      "name": "...",
      "id": "...",
    };

    if(users.scope.indexOf('moderator') >= 0) {
      moderator["name"] = users.name;
      moderator["id"]   = users.id;
      kyc_flag          = payload.moderatorStatus;

      if(payload.moderatorStatus == "REJECTED") {
        colorStatus = 'R';
      } else if(payload.moderatorStatus == "UNVERIFIED") {
        colorStatus = 'U';
      } else if(payload.moderatorStatus == "ONHOLD") {
        colorStatus = 'H';
      } else if(payload.moderatorStatus == "VERIFIED") {
        colorStatus = 'V';
      } else if(payload.moderatorStatus == "APPROVED") {
        colorStatus = 'C';
      }

    } else if(users.scope.indexOf('admin') >= 0 || users.scope.indexOf('supervisor') >= 0) {
      moderator["name"] = users.displayName;
      moderator["id"]   = users.id;
      kyc_flag          = payload.adminStatus;

      if(payload.adminStatus == "REJECTED") {
        colorStatus = 'R';
      } else if(payload.adminStatus == "UNVERIFIED") {
        colorStatus = 'U';
      } else if(payload.adminStatus == "ONHOLD") {
        colorStatus = 'H';
      } else if(payload.adminStatus == "VERIFIED") {
        colorStatus = 'V';
      } else if(payload.adminStatus == "APPROVED") {
        colorStatus = 'C';
      }
    }

    console.log()

    // Data
    let updateData = {
      "admin": admin,
      "moderator": moderator,
      "kyc_flag": ((kyc_flag != '') ? kyc_flag : 'PENDING'),
      "color_status": colorStatus
    }

    kyc.getKycByKycId(payload.id, (e, kyc1) => {
      if(!e && kyc1) {
        updateData.user = kyc1.user;

        Users.getUser(kyc1.user.id, (e, u) => {
          updateData.user['mobile']    = (!e && u && u.mobile ? u.mobile : '');
          updateData.admin['name']     = (kyc1 ? kyc1.admin.name : "...");
          updateData.admin['id']       = (kyc1 ? kyc1.admin.id : "...");
          updateData.moderator['name'] = (kyc1 ? kyc1.moderator.name : "...");
          updateData.moderator['id']   = (kyc1 ? kyc1.moderator.id : "...");

          // Kyc Updates
          kyc.updateKYC(payload.id, updateData, function(e, kyc) {
            // Log Data Into Table
            LogData.createLogData(kyc1, payload, users, 'KYC', (el, log) => {
              if(!e) {
                return _s.out(200, {"hasError": false, "message": 'KYC updated successfully.'}, null);
              }
              else {
                return _s.out(200, {"hasError": true, "message": c}, e)
              }
            });
          });
        });
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Kyc not found"}, e)
      }
    });
  }
}

module.exports = (request, reply) => {
  let kycUpdate = new KYCUpdate(request, reply);
  return kycUpdate.processRequest();
}
