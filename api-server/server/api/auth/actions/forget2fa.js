'use strict';

let ApiBaseActions    = require('./../../apibase.actions');
const TwoFactor       = require('node-2fa');
const Authy           = require('authy')(process.env.AUTHY_API_KEY);
let EmailNotification = require('./../../../component/email-notification');

class Forget2FA extends ApiBaseActions {

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
    let Users    = this.app.users;
    let Token    = this.app.verifytoken;
    let payload  = this.req.payload;
    let _s       = this;
    let Emails   = new EmailNotification(this.app.ConfigSettings);

    try{

      Token.findValuesTokenById(payload.key, (e, t) => {
        if(!e && t) {
          Users.getUser(t.userid, (e, u) => {
            if(!e && u) {
              let generate2FA = TwoFactor.generateSecret({"name": u.username, "account": t.userid});
              let qr          = generate2FA.qr;
              let generatedQr = qr.substr(0, qr.lastIndexOf('=')) + '=' + u.external_id;

              Emails.sendMail(u, u.email, 'BBApp: Forget 2FA', '/../emails/reset-2fa.html', null, null, generatedQr, function(e, u) {
                console.log(e, u);
              });

              return _s.out(200, {"hasError": false, "message": "Please check your mail to recover your 'Two Factor Authentication'"}, null);
            }
            else {
              return _s.out(200, {"hasError": true, "message": "Unable complete your request"}, e);
            }
          });
        }
        else {
          return _s.out(200, {"hasError": true, "message": "Invalid verify token."}, e);
        }
      });
    } 
    catch(e) {
      return _s.out(200, {"hasError": true, "message": "Invalid verify token."}, e);
    }
  }
}

module.exports = (request, reply) => {
  let forget2FA = new Forget2FA(request, reply);
  return forget2FA.processRequest();
}
