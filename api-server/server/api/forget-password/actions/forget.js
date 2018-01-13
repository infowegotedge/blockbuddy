'use strict';

let ApiBaseActions    = require('./../../apibase.actions');
let EmailNotification = require('./../../../component/email-notification');

class ForgetPassword extends ApiBaseActions {

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
    let that           = this;
    let users          = this.app.users;
    let forgetPassword = this.app.forgetpassword;
    let payload        = this.req.payload;
    let query          = this.req.query;
    let Emails         = new EmailNotification(this.app.ConfigSettings);

    // Find User By Email Address
    users.findByEmail(payload.email, function(e, u) {
      if(!e && u && typeof u != 'string') {
        // Forget Password
        forgetPassword.insertForgetPassword({"userid": u._id, "verify_type": "forget"}, function(e, f) {
          if(!e && f) {
            Emails.sendMail(u, u.email, 'BlockBuddy Password Change', '/../emails/reset-password.html', null, null, {
              "validtoken": f.validtoken, 
              "userName": u.username
            }, function(e, u) {
              console.log(e, f);
            });

            let messageObj = {"hasError": false, "message": "Password reset link has been sent to your registered email address. Please check."};
            if((query.__t * 1) === 1) {
              messageObj.token = f.validtoken;
            }
            
            return that.out(200, messageObj, null);
          }
          else {
            return that.out(200, {"hasError": true, "message": "Unable to create request for forget password. Please try after some time."}, e);
          }
        });
      }
      else {
        return that.out(200, {"hasError": true, "message": 'User not found.'}, e);
      }
    });
  }
}

module.exports = (request, reply) => {
  let forgetPassword = new ForgetPassword(request, reply);
  return forgetPassword.processRequest();
}