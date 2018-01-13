'use strict';

let ApiBaseActions = require('./../../../apibase.actions');
let SignJWT = require('./../../../../component/sign_jwt');
let Request = require('request');

class UsersGrantAccess extends ApiBaseActions {

  /**
   * 
   * @param {Request} request 
   * @param {Reply} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  /**
   * 
   * @param {Number} code 
   * @param {Object} data 
   */
  out(code, data) {
    return super.response(code, data);
  }

  /**
   * Process Request
   */
  processRequest() {
    let Users   = this.app.users;
    let Token   = this.app.verifytoken;
    let payload = this.req.payload;
    let _s      = this;

    // Find User By Login Username
    Users.findAdminUserForLogin(payload.username, (e, u) => {
      if(!e && u) {
        Request.get(process.env.TRADE_API_URL + '/trader/auth?adminToken='+process.env.TRADE_ADMIN_TOKEN+'&adminPassword='+process.env.TRADE_ADMIN_PASSWORD+'&username='+u.username, (er, http, body) => {
          let r    = (!er && body ? JSON.parse(body) : {});
          let role = 'user';
          let tokenValue = {"id": u._id,
            "scope": u.role,
            "email": u.email,
            "name": (u.fname + ' ' + u.lname),
            "displayName": u.username,
            "sponsorid": u.sponsorid,
            "sponsorName" : u.sponsorname,
            "sponsorUsername": u.sponsorusername,
            "enable2FA": (u.enable_2fa && (u.enable_authy || u.enable_google)),
            "externalId": (u.external_id ? u.external_id : null),
            "externalType": ((u.enable_2fa && u.enable_authy) ? 'AUTHY' : ((u.enable_2fa && u.enable_google) ? 'GOOGLE' : null))
          };
          let _jwtSign = SignJWT.encode(tokenValue);

          // Login token inserted
          Token.insertToken({ "userid": u._id, "token": _jwtSign }, process.env.TOKEN_EXPIRES_EXTO, function(e, t) {

            if(e) {
              return _s.out(200, {"hasError": true, "message": "Unable to login."});
            }
            else {
              return _s.out(200, {"hasError": false, "token": t.token, "exipresIn": process.env.TOKEN_EXPIRES_EXTO, "twoFactor": false, "role": role, "tokenValue":(r && r.authToken ? r.authToken : null)});
            }
          });
        })
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Users not found."})
      }
    })
  }
}

module.exports = (request, reply) => {
  let usersGrantAccess = new UsersGrantAccess(request, reply);
  return usersGrantAccess.processRequest();
}