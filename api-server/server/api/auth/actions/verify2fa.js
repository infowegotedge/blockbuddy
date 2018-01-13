'use strict';

let ApiBaseActions = require('./../../apibase.actions');
const TwoFactor    = require('node-2fa');
const Crypt        = require('crypto');
const Authy        = require('authy')(process.env.AUTHY_API_KEY);

class VerifyTwoFactor extends ApiBaseActions {

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
    let Token   = this.app.verifytoken;
    let payload  = this.req.payload;
    let _s       = this;
    let decipher = Crypt.createDecipher('aes192', process.env.AUTH_CLIENT_SECRET);

    // Decrypted Token
    try{
      let decrypted  = decipher.update(payload.token_key, 'hex', 'utf8');
          decrypted += decipher.final('utf8');

      if(payload.verifyBy.toUpperCase() === 'GOOGLE') {

        let validate = TwoFactor.verifyToken(decrypted, payload.token+'');
        if(validate && validate.delta === 0) {
          // Token By ID
          Token.findTokenById(payload.key, (e, t) => {
            if(!e) {
              return _s.out(200, {"hasError": false, "token": t, "exipresIn": process.env.TOKEN_EXPIRES}, null);
            }
            else {
              return _s.out(200, {"hasError": true, "message": "Invalid verify token."}, e);
            }
          });
        }
        else {
          return _s.out(200, {"hasError": true, "message": "Invalid verify token."}, null);
        }
      }
      else if(payload.verifyBy.toUpperCase() === 'AUTHY') { 
        // Authy Verify Token
        Authy.verify(decrypted, payload.token, function (err, res) {
          if(!err) {
            // Token By ID
            Token.findTokenById(payload.key, (e, t) => {
              if(!e) {
                return _s.out(200, {"hasError": false, "token": t, "exipresIn": process.env.TOKEN_EXPIRES}, null);
              }
              else {
                return _s.out(200, {"hasError": true, "message": "Invalid verify token."}, e);
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
  let verifyTwoFactor = new VerifyTwoFactor(request, reply);
  return verifyTwoFactor.processRequest();
}