'use strict';

let ApiBaseActions = require('./../../apibase.actions');
let Request = require('request');
let SignJWT = require('./../../../component/sign_jwt');

class ResumeLogin extends ApiBaseActions {

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
  out(code, data) {
    return super.response(code, data);
  }

  /**
   * Process Request
   */
  processRequest() {
    let payload = this.req.payload;
    let Users   = this.app.users;
    let Token   = this.app.verifytoken;
    let auth    = this.req.auth;
    let current = new Date();
    let _s      = this;

    let tokenValue = {
      "id": auth.credentials.id,
      "scope": auth.credentials.scope,
      "email": auth.credentials.email,
      "name": auth.credentials.name,
      "displayName": auth.credentials.displayName,
      "sponsorid": auth.credentials.sponsorid,
      "sponsorName" : auth.credentials.sponsorName,
      "sponsorUsername": auth.credentials.sponsorUsername,
      "enable2FA": auth.credentials.enable2FA,
      "externalId": auth.credentials.externalId,
      "externalType": auth.credentials.externalType
    };

    let _jwtSign = SignJWT.encode(tokenValue);

    Token.updateToken(auth.artifacts, { "userid": auth.credentials.id, "token": _jwtSign }, process.env.TOKEN_EXPIRES, (e, c) => {
      Request.get(process.env.TRADE_API_URL + '/trader/auth?adminToken='+process.env.TRADE_ADMIN_TOKEN+'&adminPassword='+process.env.TRADE_ADMIN_PASSWORD+'&username='+auth.credentials.displayName, (_e, http, body) => {
        if(e || _e || !c) {
          return _s.out(200, {"hasError": true, "message": "Error: You are now logout"});
        }
        else {
          let r = (!_e && body ? JSON.parse(body) : {});
          return _s.out(200, {"hasError": false, "token": c.token, "exipresIn": process.env.TOKEN_EXPIRES, "tokenValue":(r && r.authToken ? r.authToken : null)});
        }
      });
    })
  }
}

module.exports = (request, reply) => {
  let resumeLogin = new ResumeLogin(request, reply);
  return resumeLogin.processRequest();
}
