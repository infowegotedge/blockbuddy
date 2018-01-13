'use strict';

const uuidV1 = require('uuid/v1');

class ForgetPassword {
  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // User Schema Definition
    let forgetPasswordSchema = new Schema({
      userid: { type: Object },
      validtoken: { type: String },
      expireat: { type: Number },
      verify_type: { type: String }
    });

    forgetPasswordSchema.index({validtoken: -1, user: -1, verify_type: -1});
    this.ForgetPassword = connection.model('ForgetPassword', forgetPasswordSchema);
  }

  /**
   * Insert Forget Password
   * @param {Object} newValue
   * @param {callback} cb
   */
  insertForgetPassword(newValue, cb) {
    newValue.validtoken  = uuidV1();
    newValue.expireat    = new Date().getTime() + (parseInt(process.env.FORGET_EXPIRE_AT) * 1000);
    let forgetPassword   = new this.ForgetPassword(newValue);
    return forgetPassword.save(cb);
  }

  /**
   * Find Forget Password
   * @param {String} findValue
   * @param {callback} cb
   */
  findForgetPassword(findValue, cb) {
    let newTime = new Date().getTime();
    return this.ForgetPassword.findOne({"validtoken": findValue, "expireat": {"$gte": newTime}, "verify_type": "forget"}, function(e, f) {
      if(e || !f) {
        return cb(true, 'Invalid forget password token specified.');
      }

      return cb(false, f);
    })
  }

  /**
   * Delete Forget Password
   * @param {String} forgetId
   * @param {callback} cb
   */
  deleteForgetPassword(forgetId, cb) {
    let that = this;
    return that.ForgetPassword.remove({"userid": forgetId}, (e, f) => {
      return that.insertForgetPassword({"userid": forgetId, "verify_type": "change"}, cb);
    });
  }
}

module.exports = ForgetPassword;
module.exports.getName = () => {
  return 'forgetpassword';
}