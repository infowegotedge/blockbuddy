'use strict';

// let Binary = require('./../../../../tasks/binary');

class Repurchase {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // Repurchase Schema
    let rePurchaseSchema = new Schema({
      userid: { type: Object },
      item_name: { type: String },
      doj: { type: Date },
      sponsor: { type: String },
      left_count: { type: Number },
      right_count: { type: Number },

      own_rpv: { type: Number },
      
      left_rpv_count: { type: Number },
      right_rpv_count: { type: Number },

      left_rpv_count1: { type: Number },
      right_rpv_count1: { type: Number },

      total_direct: { type: Number },
      virtual_pairs: { type: Number },
      balance_pv: { type: Number },
      carry_forward: { type: Number },
      repurchase: { type: Boolean },
      status: { type: Number }
    });

    this.Repurchase = connection.model('Repurchase', rePurchaseSchema);
  }

  /**
   * 
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  saveRePurchase(newValue, cb) {
    let repurchase = new this.Repurchase(newValue);
    repurchase.save(cb);
  }

  /**
   * 
   * @param {String} status 
   * @param {callback} cb 
   */
  findRepuchase(status, cb) {
    return this.Repurchase.find({"status": 1}).sort({"_id": 1}).exec(cb);
  }

  /**
   * 
   * @param {Object} newValue 
   * @param {String} userId 
   * @param {callback} cb 
   */
  updateValue(newValue, userId, cb) {
    return this.Repurchase.update({"status": 1, "userid": userId}, {"$set": newValue}, {"multi": true}, cb);
  }
}

module.exports = Repurchase;
module.exports.getName = () => {
  return 'repurchase';
}