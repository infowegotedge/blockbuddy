'use strict';

let ApiBaseActions = require('./../../apibase.actions');
// let jwt = require('jsonwebtoken');
let SignJWT = require('./../../../component/sign_jwt');
let Authy   = require('authy')(process.env.AUTHY_API_KEY);
let Crypt   = require('crypto');
let Request = require('request');

class Login extends ApiBaseActions {

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
    let current = new Date();
    let _s      = this;
    
    Users.login(payload, function(e, u) {
      if(e) {
        let message = "Username or Password is incorrect";

        if(u && (/email verification/.test(u) || /blocked by admin/.test(u))) {
          message = u;
        }
        
        return _s.out(200, {"hasError": true, "message": message});
      }
      else 
      {
        Request.get(process.env.TRADE_API_URL + '/trader/auth?adminToken='+process.env.TRADE_ADMIN_TOKEN+'&adminPassword='+process.env.TRADE_ADMIN_PASSWORD+'&username='+u.username, (e, http, body) => {
          let r    = (!e && body ? JSON.parse(body) : {});
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

          if(u.role.indexOf('user') >= 0) {
            role = u.role[u.role.indexOf('user')];
          }
          else if(u.role.indexOf('admin') >= 0) {
            role = u.role[u.role.indexOf('admin')];
          }
          else if(u.role.indexOf('moderator') >= 0) {
            role = u.role[u.role.indexOf('moderator')];
          }
          else if(u.role.indexOf('supervisor') >= 0) {
            role = u.role[u.role.indexOf('supervisor')];
          }

          Token.insertToken({ "userid": u._id, "token": _jwtSign }, process.env.TOKEN_EXPIRES, function(e, t) {

            if(e) {
              return _s.out(200, {"hasError": true, "message": "Unable to login."});
            }
            else {

              if(u.enable_2fa && (u.enable_authy || u.enable_google)) {
                let cipher     = Crypt.createCipher('aes192', process.env.AUTH_CLIENT_SECRET);
                let encrypted  = cipher.update(u.external_id, 'utf8', 'hex');
                    encrypted += cipher.final('hex');
                
                if(u.enable_authy) {
                  Authy.request_sms(u.external_id, function (err, res) {
                    if(err) {
                      t.remove((et, rt) => {
                        return _s.out(200, {"hasError": true, "message": "Unable to login."});
                      });
                    }
                    else {
                      return _s.out(200, {"hasError":false, "key":t._id, "token_key":encrypted, "twoFactor":true, "code":"AUTHY", "role":role, "tokenValue":(r && r.authToken ? r.authToken : null)});
                    }
                  });
                }
                else if(u.enable_google) {
                  return _s.out(200, {"hasError": false, "key": t._id, "token_key": encrypted, "twoFactor": true, "code": "GOOGLE", "role": role, "tokenValue": (r && r.authToken ? r.authToken : null)});
                }
              }
              else {
                return _s.out(200, {"hasError": false, "token": t.token, "exipresIn": process.env.TOKEN_EXPIRES, "twoFactor": false, "role": role, "tokenValue": (r && r.authToken ? r.authToken : null)});
              }
            }
          });
        });
      }
    });
  }
}

module.exports = (request, reply) => {
  let creator = new Login(request, reply);
  return creator.processRequest();
}
