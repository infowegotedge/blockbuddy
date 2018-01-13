'use strict';

let ApiBaseActions = require('./../../apibase.actions');
const TwoFactor    = require('node-2fa');
const Crypt        = require('crypto');
const Authy        = require('authy')(process.env.AUTHY_API_KEY);

class ValidateTwoFactor extends ApiBaseActions {

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
    let Users    = this.app.users;
    let user     = this.req.auth.credentials;
    let payload  = this.req.payload;
    let _s       = this;
    let decipher = Crypt.createDecipher('aes192', process.env.AUTH_CLIENT_SECRET);

    try {
      let decrypted  = decipher.update(payload.key, 'hex', 'utf8');
          decrypted += decipher.final('utf8');

      // Process Google
      if(payload.verifyBy.toUpperCase() === 'GOOGLE') {

        let validate = TwoFactor.verifyToken(decrypted, payload.token+'');
        if(validate && validate.delta === 0) {
          Users.enable2FA(user.id, decrypted, 'google', (e, r) => {
            if(!e) {
              return _s.out(200, {"hasError": false, "message": "Two factor enable successfully."}, null);
            }
            else {
              return _s.out(200, {"hasError": true, "message": "Unable to save verify token."}, e);
            }
          });
        }
        else {
          return _s.out(200, {"hasError": true, "message": "Invalid verify token."}, null);
        }
      }
      else if(payload.verifyBy.toUpperCase() === 'AUTHY') { 

        // Process Authy
        Authy.verify(decrypted, payload.token, function (err, res) {
          if(!err && res) {
            Users.enable2FA(user.id, decrypted, 'authy', (e, r) => {
              if(!e) {
                return _s.out(200, {"hasError": false, "message": "Two factor enable successfully."}, null);
              }
              else {
                return _s.out(200, {"hasError": true, "message": "Unable to save verify token."}, e);
              }
            });
          }
          else {
            return _s.out(200, {"hasError": true, "message": "Invalid verify token."}, err);
          }
        });
      }
    }
    catch(e) {
      return _s.out(200, {"hasError": true, "message": "Invalid verify token."}, e);
    }
  }
}

module.exports = (request, reply) => {
  let validateTwoFactor = new ValidateTwoFactor(request, reply);
  return validateTwoFactor.processRequest();
}