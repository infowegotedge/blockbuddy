'use strict';

let ApiBaseActions = require('./../../apibase.actions');
let jwt = require('jsonwebtoken');

class UserMe extends ApiBaseActions {

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
    let KycStats = this.app.kyc;
    let _s       = this;
    
    // Find User
    Users.query(headers, function(e, u) {
      if(!e && !u) {
        return _s.out(200, {"hasError": true, "message": "Invalid token"}, e);
      }
      else {
        // Get User
        Users.getUser(u.sponsorid, function(es, s) {
          KycStats.getKycById(headers.id, (e, kyc) => {
            return _s.out(200, {
              "hasError": false,
              "user": {
                "avatar": (u.image ? ((!u.image.indexOf('http') || !u.image.indexOf('https')) ? u.image : process.env.AWS_PATH+u.image) : ''),
                "first_name": u.fname,
                "last_name": u.lname,
                "name": u.fname + ' ' + u.lname,
                "email": u.email,
                "username": u.username,
                "mobile": u.mobile,
                "country": u.country,
                "sponsorUsername": ((s && s.username) ? s.username : ''),
                "sponsorName": ((s && s.fname) ? (s.fname + ' ' + s.lname) : ''),
                "address": (u.address || ''),
                "city": (u.city || ''),
                "state": (u.state || ''),
                "postal": (u.postal || ''),
                "enable2FA": (u.enable_2fa && (u.enable_google || u.enable_authy)),
                "kycStatus": (!e && kyc ? kyc.kyc_flag : 'UNVERIFIED'),
                "profile_updated": (u.profile_updated || false)
              }
            }, null);
          });
        });
      }
    });
  }
}

module.exports = (request, reply) => {
  let creator = new UserMe(request, reply);
  return creator.processRequest();
}
