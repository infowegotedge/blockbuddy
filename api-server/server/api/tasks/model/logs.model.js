'use strict';

// const crypt = require('crypto')

class LogData {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // Tasks Schema Definition
    let logDataSchema = new Schema({
      before_data: { type: Object },
      new_data: { type: Object },
      created_at: { type: Date, "default": Date.now },
      userid: { type: String },
      username: { type: String },
      update_type: { type: String },
      user_role: { type: Array },
    });

    // LogData Schema
    this.LogData = connection.model('logdata', logDataSchema);
  }

  /**
   * 
   * @param {String} taskName 
   * @param {String} taskId
   * @param {callback} cb 
   */
  createLogData(oldValue, newValue, auth, type, cb) {
    let logData = new this.LogData({
      "before_data": oldValue,
      "new_data": newValue,
      "created_at": (new Date()).toISOString(),
      "userid": auth.id,
      "username": auth.displayName,
      "update_type": type,
      "user_role": auth.scope
    });

    logData.save(cb);
  }
}

module.exports = LogData;
module.exports.getName = () => {
  return 'logdata';
}