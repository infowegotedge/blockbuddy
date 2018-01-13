'use strict';

// const crypt = require('crypto')

class BinaryCommission {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // BinaryCommission Schema Definition
    let binaryCommissionSchema = new Schema({
      userid: { type: Object },
      commission: { type: Number },
      created_at: { type: Date },
      description: { type: String },
      status: { type: String },
      repurchase: { type: Boolean }
    });

    // Commission Schema Definition
    let commissionSchema = new Schema({
      level_number: { type: Number },
      commission_type: { type: String },
      commission: { type: Number },
      created_at: { type: Date, "default": Date.now },
      updated_at: { type: Date },
      is_deleted: { type: Boolean },
      delete_date: { type: Date }
    })

    // BinaryCommission Schema
    this.BinaryCommission = connection.model('BinaryCommission', binaryCommissionSchema);
    // Commission Schema
    this.Commission = connection.model('Commission', commissionSchema);
  }

  /**
   * 
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  create(newValue, cb) {
    let binaryCommission = new this.BinaryCommission(newValue);
    return binaryCommission.save(function(e, b) {
      if(e) {
        return cb(true, e);
      }
      return cb(false, b);
    });
  }

  /**
   * 
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  createCommission(newValue, cb) {
    let dateTime = (new Date()).toISOString()
    newValue["created_at"] = dateTime;
    newValue["updated_at"] = dateTime;
    newValue["is_deleted"] = false;

    let commission = new this.Commission(newValue);
    return commission.save(function(e, b) {
      if(e) {
        return cb(true, e);
      }
      return cb(false, b);
    });
  }

  /**
   * 
   * @param {String} commissionId
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  updateCommission(commissionId, newValue, cb) {
    let dateTime = (new Date()).toISOString()
    newValue["updated_at"] = dateTime;
    newValue["is_deleted"] = false;

    return this.Commission.update({"_id": commissionId}, newValue, (e, b) => {
      if(e) {
        return cb(true, e);
      }
      return cb(false, b);
    });
  }

  /**
   * 
   * @param {String} commissionId
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  deleteCommission(commissionId, cb) {
    let dateTime = (new Date()).toISOString()
    let newValue = {
      "is_deleted": true,
      "delete_date": dateTime
    };

    return this.Commission.update({"_id": commissionId}, newValue, (e, b) => {
      if(e) {
        return cb(true, e);
      }
      return cb(false, b);
    });
  }

  /**
   * 
   * @param {Object} query
   * @param {callback} cb 
   */
  countCommission(query, cb) {
    return this.BinaryCommission.count(query, cb);
  }

  /**
   * 
   * @param {String} userId
   * @param {Number} curPage 
   * @param {Number} perPage 
   * @param {callback} cb 
   */
  findBinaryCommission(userId, curPage, perPage, cb) {
    let offset = ((curPage - 1) * perPage);
    let query  = {'userid': userId, "repurchase": false};
    let that   = this;

    let binaryCommission = this.BinaryCommission.find(query).sort({"created_at": -1}).limit(perPage);

    if(offset !== 0) {
      binaryCommission = binaryCommission.skip(offset);
    }

    binaryCommission.exec(function(e, c) {
      if(!e) {
        return that.countCommission(query, (er, count) => {
          return cb(false, {"commissions": c, count: (!er && count ? count : 0)});
        });
      }
      else {
        return cb(true, 'No commissions found');
      }
    })
  }

  /**
   * 
   * @param {Object} query
   * @param {callback} cb 
   */
  countCommissions(query, cb) {
    return this.BinaryCommission.count(query, cb);
  }

  /**
   * 
   * @param {Number} curPage 
   * @param {Number} perPage 
   * @param {callback} cb 
   */
  findCommission(curPage, perPage, cb) {
    let offset = ((curPage - 1) * perPage);
    let query  = {"is_deleted": false};
    let that   = this;

    let commission = this.Commission.find(query).sort({"created_at": -1}).limit(perPage);

    if(offset !== 0) {
      commission = commission.skip(offset);
    }

    commission.exec(function(e, c) {
      if(!e) {
        return that.countCommissions(query, (er, count) => {
          return cb(false, {"commissions": c, count: (!er && count ? count : 0)});
        });
      }
      else {
        return cb(true, 'No commissions found');
      }
    })
  }

  /**
   * 
   * @param {callback} cb 
   */
  findTaskCommission(cb) {
    let query  = {"is_deleted": false};
    let that   = this;
    let commission = this.Commission.find(query).sort({"level_number": 1, "created_at": 1});

    commission.exec((e, c) => {
      if(!e) {
        return cb(false, c);
      }
      else {
        return cb(true, 'No commissions found');
      }
    })
  }

  /**
   * 
   * @param {String} userId
   * @param {Number} curPage 
   * @param {Number} perPage 
   * @param {callback} cb 
   */
  findRepurchaseCommission(userId, curPage, perPage, cb) {
    let offset = ((curPage - 1) * perPage);
    let query  = {'userid': userId, "repurchase": true};
    let that   = this;

    let binaryCommission = this.BinaryCommission.find(query).sort({"created_at": -1}).limit(perPage);

    if(offset !== 0) {
      binaryCommission = binaryCommission.skip(offset);
    }

    binaryCommission.exec(function(e, c) {
      if(!e) {
        return that.countCommission(query, (er, count) => {
          return cb(false, {"commissions": c, count: (!er && count ? count : 0)});
        });
      }
      else {
        return cb(true, 'No commissions found');
      }
    })
  }
}

module.exports = BinaryCommission;
module.exports.getName = () => {
  return 'binaryCommission';
}