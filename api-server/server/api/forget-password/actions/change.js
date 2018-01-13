'use strict';

let ApiBaseActions    = require('./../../apibase.actions');
let EmailNotification = require('./../../../component/email-notification');

class ChangePassword extends ApiBaseActions {

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
    let Emails         = new EmailNotification(this.app.ConfigSettings);

    if(payload.password !== payload.confirmpassword) {
      return that.out(200, {"hasError": true, "message": "Password and confirm password do not match"}, null)
    }
    else {
      // Find Forget Password 
      forgetPassword.findForgetPassword(payload.token, function(e, f) {
        if(!e) {
          payload.id = f.userid;

          // Change Password 
          users.changeForgetPassword(payload, function(_e, u) {
            if(!_e && u) {
              forgetPassword.deleteForgetPassword(f.userid, function(e, df) {
                Emails.sendMail(u, u.email, 'BBApp: Change Password', '/../emails/change-password.html', null, null, df.validtoken, function(e, u) {
                  console.log(e, u);
                });
                return that.out(200, {"hasError": false, "message": "Password changed successfully."}, null);
              });
            }
            else {
              return that.out(200, {"hasError": true, "message": "Unable to change password. Please try after some time."}, _e);
            }
          });
        }
        else {
          return that.out(200, {"hasError": true, "message": f}, e);
        }
      });
    }
  }
}

module.exports = (request, reply) => {
  let changePassword = new ChangePassword(request, reply);
  return changePassword.processRequest();
}