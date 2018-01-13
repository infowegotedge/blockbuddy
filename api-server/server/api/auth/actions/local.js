'use strict';

let ApiBaseActions    = require('./../../apibase.actions');
let Coinbase          = require('./../../../component/coinbase_api');
// let CoinbaseApi       = require('./../../purchase/model/purchase.json');
let EmailNotification = require('./../../../component/email-notification');
let jwt               = require('jsonwebtoken');
let Request           = require('request');

class AuthLocal extends ApiBaseActions {

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

  processRequest() {
    let _jwtSign = null;
    if (super.isAuthenticated) {
      let _auth = super.authObject;
      let _profile = _auth.credentials.profile;
      let _token = _auth.credentials.token;
      let _cert = new Buffer(process.env.AUTH_CLIENT_SECRET, 'base64')

      _jwtSign = jwt.sign({
        "id": _token,
        "email": _profile.email,
        "displayName": _profile.displayName
      }, _cert, {
        algorithm: process.env.TOKEN_ALGORITHS,
        audience: process.env.AUTH_CLIENT_AUDIENCE
      });

      return super.tempRedirect('/authorized?token=' + _jwtSign);
    } else {
      return super.response(200, {
        params: super.requestQuery,
        payload: super.requestParams,
        body: super.requestBody,
        token: _jwtSign
      });
    }
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

  sendEmailsToUser(user, verifyCode, Emails, Users) {
    Emails.sendMail(user, user.email, 'Welcome to BBApp', '/../emails/welcome-email.html', null, null, verifyCode, function(e, u) {
      console.log(e, u);
    });

    Users.findSponsorUser(user.sponsorusername, function(_es, _so) {
      if(!_es && _so) {
        Emails.sendMail(_so, _so.email, 'BlockBuddy: User has been signup under you', '/../emails/signup-sponsor.html', null, null, {
          fullname: user.fname + ' ' + user.lname,
          username: user.username
        }, function(e, u) {
          console.log(e, u);
        });
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
  __saveUser(payload, query, addedPos, data, Users, KycUser, AffiliatesCount, Emails) {
    let _s = this;

    // Create User In Trading System
    Request.post({url: process.env.TRADE_API_URL + '/trader/create?adminToken=abb3cfcf-f10b-4058-8ffd-3deb864d84c1&adminPassword=acag151Hsg*w3453', form: {
      'firstName': payload.fname,
      'lastName': payload.lname,
      'userName': payload.username,
      'email': payload.email,
      'contactNumber': payload.mobile,
      'address': payload.address || '',
      'country': payload.country,
      'locale': ''
    }}, (e, httpBody, body) => {
      // Todo: Authenticate
      let parseBody = (!e ? JSON.parse(body) : null);
      if(e || !parseBody || (parseBody && parseBody.error)) {
        console.log(e);
        return _s.out(200, {"hasError": true, "message": (parseBody && parseBody.message ? parseBody.message : "Unknown error, Please try after some time")});
      }
      else {
        // Create User In System
        Users.save(payload, function(e, u) {
          if (!e && u) {
            let v = u.emailVerify;
                u = u.user;
          
            Users.sponsor(payload, function(_e, s) {
              if (!_e) {
                if (!addedPos) {
                  payload.position = (s !== null && s.position == 'L' ? 'R' : 'L');
                }
    
                payload.userid = u._id;
                Users.saveSponsor(payload, function() {

                  // Send Emails
                  _s.sendEmailsToUser(u, v, Emails, Users);
    
                  let message = { signup: 'Success full' };
                  if((query.__t * 1) === 1) {
                    message.token = v;
                  }
    
                  KycUser.create({}, u, u._id, (e, k) => {
                    Users.saveUserForCommission(payload, (ec, commission) => {
                      Users.findUserByUsername(payload.sponsor, (e, u) => {
                        if(!e && u) {
                          AffiliatesCount.updateSignupCount(u._id, u.username, (e, a) => {
                            return _s.out(200, message);
                          });
                        }
                        else {
                          return _s.out(200, message);
                        }
                      });
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
   * Process Request
   */
  postProcessRequest() {
    let payload   = this.req.payload;
    let Users     = this.app.users;
    let KycUser   = this.app.kyc;
    let AffiliatesCount = this.app.AffiliatesCount;
    let Positions = this.app.position;
    let LeftRight = this.app.purchase;
    let query     = this.req.query;
    let _s        = this;
    let data      = {"username": payload.sponsorid, "id": (payload.campaignid || payload.bannerid || '')};
    let addedPos  = false;
    let Emails    = new EmailNotification(this.app.ConfigSettings);

    payload.create_at = (new Date()).toISOString();
    payload.role = ['user', 'transaction'];
    payload.username = payload.username.toLowerCase().trim();

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
              return _s.__saveUser(payload, query, addedPos, data, Users, KycUser, AffiliatesCount, Emails);
            }
            else {
              payload.position = null;
              addedPos         = false;
              return _s.__saveUser(payload, query, addedPos, data, Users, KycUser, AffiliatesCount, Emails);
            }
          });
        }
        else {
          return _s.__saveUser(payload, query, addedPos, data, Users, KycUser, AffiliatesCount, Emails);
        }
      });
    });
  }
}

module.exports = (request, reply) => {
  let creator = new AuthLocal(request, reply);
  if (request.method == 'post') {
    return creator.postProcessRequest();
  }

  return creator.processRequest();
}