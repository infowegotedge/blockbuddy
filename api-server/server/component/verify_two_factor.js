'use strict';

const TwoFactor = require('node-2fa');
const Authy     = require('authy')(process.env.AUTHY_API_KEY);

class VerifyTwoFactorAuth {

  // constructor 
  constructor(externalId, type) {
    this.secret      = externalId;
    this.requestType = type;
  }

  /**
   * Request SMS
   * @param {callback} cb 
   */
  requestSMS(cb) {

    if(this.requestType.toUpperCase() === 'AUTHY') {
      Authy.request_sms(this.secret, function (err, res) {
        if(err) {
          return cb(false, 'Message sent.')
        }
        else {
          return cb(true, 'Message not sent.')
        }
      });
    }
    else {
      return cb(false, 'Message sent.')
    }
  }

  /**
   * Verify Request
   * @param {callback} cb 
   */
  verifyRequest(token, cb) {

    if(this.requestType.toUpperCase() === 'GOOGLE') {
      let validate = TwoFactor.verifyToken(this.secret, token+'');
      if(validate && validate.delta === 0) {
        return cb(false, 'Verified token.');
      }
      else {
        return cb(true, 'Invalid token.');
      }
    }
    else if(this.requestType.toUpperCase() === 'AUTHY') { 
      Authy.verify(this.secret, token, function (err, res) {
        if(!err) {
          return cb(false, 'Verified token.');
        }
        else {
          return cb(true, 'Invalid token.');
        }
      });
    }
    else {
      return cb(true, 'Invalid request.');
    }
  }
}

module.exports = VerifyTwoFactorAuth;