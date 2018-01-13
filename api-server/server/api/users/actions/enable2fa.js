'use strict';

let ApiBaseActions = require('./../../apibase.actions');
const TwoFactor    = require('node-2fa');
const Crypt        = require('crypto');
const Authy        = require('authy')(process.env.AUTHY_API_KEY);

class EnableTwoFactor extends ApiBaseActions {

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
    let user    = this.req.auth.credentials;
    let payload = this.req.payload;
    let _s      = this;

    try {
      let cipher  = Crypt.createCipher('aes192', process.env.AUTH_CLIENT_SECRET);
      
      // Process Google
      if(payload.verifyBy.toUpperCase() === 'GOOGLE') {
        let generate2FA = TwoFactor.generateSecret({"name": user.displayName, "account": user.id});
        let secret      = generate2FA.secret;
        let qr          = generate2FA.qr;
        let encrypted   = cipher.update(secret, 'utf8', 'hex');
            encrypted  += cipher.final('hex');
        
        _s.out(200, {"hasError": false, "twoFactor": {
          "key": encrypted,
          "qrCode": qr,
          "code": payload.verifyBy
        }}, null);
      }
      // Process Authy
      else if(payload.verifyBy.toUpperCase() === 'AUTHY') {
        Authy.register_user(user.email, payload.mobileNumber, payload.countryCode, function (err, res) {
          if(!err) {
            let encrypted  = cipher.update(res.user.id+'', 'utf8', 'hex');
                encrypted += cipher.final('hex');
            
            _s.out(200, {"hasError": false, "twoFactor": {
              "key": encrypted,
              "code": payload.verifyBy
            }}, null);
          }
          else {
            _s.out(200, {"hasError": true, "message": "Unable to register on Authy."}, err);
          }
        }); 
      }
    } 
    catch(e) {
      return _s.out(200, {"hasError": true, "message": "Unable to take request. Please try after sometime."}, e)
    }
  }
}

module.exports = (request, reply) => {
  let enableTwoFactor = new EnableTwoFactor(request, reply);
  return enableTwoFactor.processRequest();
}