'use strict';

let ApiBaseActions = require('./../../apibase.actions');
// let jwt = require('jsonwebtoken');
let SignJWT = require('./../../../component/sign_jwt');
let Authy   = require('authy')(process.env.AUTHY_API_KEY);
let Crypt   = require('crypto');
let Request = require('request');

class LoginSignUp extends ApiBaseActions {

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

  __login(u, _s, Token, current) {

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

    Token.insertToken({ "userid": u._id, "token": _jwtSign }, process.env.TOKEN_EXPIRES, function(e, t) {

      if(e) {
        return _s.out(200, {"hasError": true, "message": "Unable to login."});
      }
      else {

        Request.get(process.env.TRADE_API_URL + '/trader/auth?adminToken='+process.env.TRADE_ADMIN_TOKEN+'&adminPassword='+process.env.TRADE_ADMIN_PASSWORD+'&username='+u.username, (e, http, body) => {
          let r    = (!e && body ? JSON.parse(body) : {});

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
                  return _s.out(200, {"hasError": false, "key": t._id, "token_key": encrypted, "twoFactor": true, "code": "AUTHY", "role": role, "tokenValue":(r && r.authToken ? r.authToken : null)});
                }
              });
            }
            else if(u.enable_google) {
              return _s.out(200, {"hasError": false, "key": t._id, "token_key": encrypted, "twoFactor": true, "code": "GOOGLE", "role": role, "tokenValue":(r && r.authToken ? r.authToken : null)});
            }
          }
          else {
            return _s.out(200, {"hasError": false, "token": t.token, "exipresIn": process.env.TOKEN_EXPIRES, "twoFactor": false, "role": role, "tokenValue":(r && r.authToken ? r.authToken : null)});
          }

        });
      }
    });
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
    
    Users.findUserByExternalId(payload, (e, ex) => {
      if(!e && !ex) {
        let name = payload.name.split(' ');
        let fname = name[0];
        let lname = null;

        if(name.length >= 2) {
          delete(name[0]);
          name  = name.join(' ').trim();
          lname = name;
        }

        payload.username = (payload.email ? payload.email.split('@')[0] + '-bb' : null);
        payload.password = payload.id;
        payload.fname    = name[0];
        payload.lname    = (lname ? lname : ' ');

        return _s.processSignIn(payload, Token, current);
      }
      else if(!e && ex) {
        let userObj = {provider: payload.provider};
        if(!ex.provider) {
          if(payload.provider.toLowerCase() === 'facebook') {
            userObj['fb_id'] = payload.id;
          }
          else if(payload.provider.toLowerCase() === 'google') {
            userObj['google_id'] = payload.id;
          }

          return Users.updateAddress(ex._id, userObj, (e, u) => {
            return _s.__login(ex, _s, Token, current);  
          });
        }
        else {
          return _s.__login(ex, _s, Token, current);
        }
      }
      else {
        let message = "Username or Password is incorrect";
        
        if(u && (/email verification/.test(u) || /blocked by admin/.test(u))) {
          message = u;
        }
        
        return _s.out(200, {"hasError": true, "message": message});
      }
    });
  }

  /**
   * 
   * @param {Qbject} payload 
   * @param {Object} query 
   * @param {String} addedPos 
   * @param {Object} data 
   * @param {Object} Users
   * @param {EmailObject} Emails 
   */
  __saveUser(payload, query, addedPos, data, Users, KycUser, AffiliatesCount, Token, current) {
    let _s = this;

    Request.post({url: process.env.TRADE_API_URL + '/trader/create?adminToken='+process.env.TRADE_ADMIN_TOKEN+'&adminPassword='+process.env.TRADE_ADMIN_PASSWORD, form: {
      'firstName': payload.fname,
      'lastName': payload.lname,
      'userName': payload.username,
      'email': payload.email,
      'contactNumber': payload.mobile || '+1',
      'address': payload.address || '',
      'country': payload.country || '',
      'locale': ''
    }}, (e, httpBody, body) => {
      // Todo: Authenticate
      let parseBody = (!e ? JSON.parse(body) : null);
      if(e || !parseBody || (parseBody && parseBody.error)) {
        console.log(e);
        return _s.out(200, {"hasError": true, "message": (parseBody.message || "Unknown error, Please try after some time")});
      }
      else {

        Users.save(payload, function(e, u) {
          if (!e && u) {
            let v = u.emailVerify, userObject = u.user;
                u = u.user;
          
            Users.sponsor(payload, function(_e, s) {
              if (!_e) {
                if (!addedPos) {
                  payload.position = (s !== null && s.position == 'L' ? 'R' : 'L');
                }
    
                payload.userid = u._id;
                Users.saveSponsor(payload, function() {
    
                  let message = { signup: 'Success full' };
                  if((query.__t * 1) === 1) {
                    message.token = v;
                  }
    
                  KycUser.create({}, u, u._id, (e, k) => {
                    Users.findUserByUsername(payload.sponsor, (e, u) => {
                      if(!e && u) {
                        AffiliatesCount.updateSignupCount(u._id, u.username, (e, a) => {
                          return _s.__login(userObject, _s, Token, current);
                        });
                      }
                      else {
                        return _s.__login(userObject, _s, Token, current);
                      }
                    });
                  });
                });
              } else {
                Users.remove({ '_id': u._id }, function() {
                  return _s.out(200, { "hasError": true, "message": "Sponsor has error." });
                });
              }
            });
          } else {
            return _s.out(200, { "hasError": true, "message": "User email or Username already exits." })
          }
        });

      }
    });
  }

  /**
   * Process SignIn Request
   */
  processSignIn(payload, Token, current) {
    let Users     = this.app.users;
    let KycUser   = this.app.kyc;
    let AffiliatesCount = this.app.AffiliatesCount;
    let Positions = this.app.position;
    let LeftRight = this.app.purchase;
    let query     = this.req.query;
    let _s        = this;
    let data      = {"username": payload.sponsorid, "id": (payload.campaignid || payload.bannerid || '')};
    let addedPos  = false;

    payload.create_at = (new Date()).toISOString();
    payload.role = ['user', 'transaction'];

    Users.findSponsorUser(payload.sponsorid, function(e, us) {
      if (e) {
        return _s.out(200, { "hasError": true, "message": 'Sponsor not found' });
      }

      if (us !== null && us.length !== 0) {
        payload.sponsorid = us._id;
        payload.sponsorname = us.fname + " " + us.lname;
        payload.sponsorusername = us.username;
      } else {
        payload.sponsorusername = payload.username;
      }

      Positions.getPositions(payload.sponsorid, function(e, ps) {
        if (!e && ps && ps.position !== null && typeof ps.position != 'undefined') {
          payload.position = ps.position;
          addedPos         = true;
        }
        else if(addedPos === false && payload.position) {
          addedPos = true;
        }

        if(payload.position && payload.position.toUpperCase() === 'WEAK') {
          return LeftRight.findAllPurchase(payload.sponsorid, (e, p) => {
            if(!e && p) {
              addedPos = true;
              if(p.left_count < p.right_count) {
                payload.position = 'L';
              }
              else if(p.right_count < p.left_count) {
                payload.position = 'R';
              }
              else {
                payload.position = null;
                addedPos         = false;
              }
              return _s.__saveUser(payload, query, addedPos, data, Users, KycUser, AffiliatesCount, Token, current);
            }
            else {
              payload.position = null;
              addedPos         = false;
              return _s.__saveUser(payload, query, addedPos, data, Users, KycUser, AffiliatesCount, Token, current);
            }
          });
        }
        else {
          return _s.__saveUser(payload, query, addedPos, data, Users, KycUser, AffiliatesCount, Token, current);
        }
      });
    });
  }
}

module.exports = (request, reply) => {
  let creator = new LoginSignUp(request, reply);
  return creator.processRequest();
}
