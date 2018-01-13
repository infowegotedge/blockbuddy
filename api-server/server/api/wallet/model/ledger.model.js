'use strict';

class Ledger {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // Ledger Schema
    let ledgerSchema = new Schema({
      "userid": { type: Object },
      "amount": { type: Number },
      "fee": { type: Number },
      "total_amount": { type: Number },
      "status": { type: String },
      "object_id": { type: Object },
      "object_name": { type: String },
      "object_type": { type: String },
      "actual_id": { type: String },
      "sign_amount": { type: Number },
      "account_id": { type: String },
      "description": { type: String },
      "created_at": { type: Date, "default": Date.now },
      "sign": { type: String }
    });

    ledgerSchema.index({"created_at": 1, "userid": 1, "account_id": 1, "object_id": 1, "object_type": 1, "amount": 1, "fee": 1, "total_amount": 1, "status": 1});
    this.Ledger = connection.model('Ledger', ledgerSchema);
  }

  /**
   * 
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  save(newValue, cb) {
    let ledger = new this.Ledger(newValue);
    return ledger.save(cb);
  }

  /**
   * 
   * @param {Object} ledger
   * @param {Object} ledger1 
   * @param {callback} cb 
   */
  multiSave(ledger, ledger1, cb) {
    let saveLedger  = new this.Ledger(ledger);
    let saveLedger1 = new this.Ledger(ledger1);

    return saveLedger.save((e, l) => {
      return saveLedger1.save(cb);
    });
  }

  /**
   * 
   * @param {String} userId 
   * @param {callback} cb 
   */
  listCount(userId, cb) {
    return this.Ledger.count({"userid": userId}, cb);
  }

  /**
   * 
   * @param {String} userId 
   * @param {Number} currentPage 
   * @param {Number} perPage 
   * @param {callback} cb 
   */
  listLedger(userId, currentPage, perPage, cb) {
    let offset = ((currentPage - 1) * perPage);
    let query  = this.Ledger.find({"userid": userId}, 'description account_id total_amount created_at status').sort({"created_at": -1}).limit(perPage);

    if(offset > 0) {
      query = query.skip(offset);
    }

    return this.listCount(userId, (e, r) => {
      let count = 0;
      if(!e) {
        count = r;
      }

      return query.exec((e, ru) => {
        if(!e) {
          return cb(false, {"rows": ru, "count": count});
        }
        else {
          return cb((e || true), "Transactions not found.")
        }
      });
    })
  }

  /**
   * 
   * @param {String} userId 
   * @param {Number} currentPage 
   * @param {Number} perPage 
   * @param {callback} cb 
   */
  listLedgerWithdrawTransfer(userId, currentPage, perPage, cb) {
    let offset = ((currentPage - 1) * perPage);
    let query  = this.Ledger.find({"userid": userId, "object_type": {"$ne": 'PRODUCT'}}, 'description account_id total_amount created_at status').sort({"created_at": -1}).limit(perPage);

    if(offset > 0) {
      query = query.skip(offset);
    }

    return this.listCount(userId, (e, r) => {
      let count = 0;
      if(!e) {
        count = r;
      }

      return query.exec((e, ru) => {
        if(!e) {
          return cb(false, {"rows": ru, "count": count});
        }
        else {
          return cb((e || true), "Transactions not found.")
        }
      });
    })
  }

  /**
   * 
   * @param {String} userId 
   * @param {Number} currentPage 
   * @param {Number} perPage 
   * @param {callback} cb 
   */
  update(objectId, status, cb) {
    return this.Ledger.update(objectId, status, cb);
  }

  /**
   * @param {String} userId
   * @param {callback} cb
   */
  referralAmount(userId, cb) {
    return this.Ledger.aggregate([
      {"$match": {"userid": userId, "description": (new RegExp('Binary Commission')), "sign": '+'}},
      {"$group": {"_id": "$userid", "total": {"$sum": "$amount"}}}
    ], cb);
  }

  /**
   * @param {String} userId
   * @param {callback} cb
   */
  referralList(userId, limit, cb) {
    return this.Ledger.find({"userid": userId, "description": (new RegExp('Binary Commission')), "sign": '+', "object_type": "USER"}).sort({"created_at": -1}).limit(limit).exec(cb);
  }

  /**
   * @param {String} userId
   * @param {callback} cb
   */
  productBalanceById(userId, productId, cb) {
    return this.Ledger.aggregate([
      {"$match": {"userid": userId, "actual_id": productId, "status": "COMPLETED"}},
      {"$group": {"_id": "$actual_id", "total": {"$sum": "$sign_amount"}}}
    ], cb);
  }

  /**
   * @param {String} userId
   * @param {callback} cb
   */
  productAllBalance(userId, cb) {
    return this.Ledger.aggregate([
      {"$match": {"userid": userId, "object_type": "PRODUCT", "status": "COMPLETED"}},
      {"$group": {"_id": "$actual_id", "total": {"$sum": "$sign_amount"}}}
    ], cb);
  }

  /**
   * 
   * @param {Object} query 
   * @param {callback} cb 
   */
  findAdminCommissionSum(userId, cb) {
    return this.Ledger.aggregate([
      {"$match": {"userid": userId, "object_type": 'USER'}},
      {"$group": {"_id": null, "totalCommission": {$sum: "$total_amount"}}}
    ], cb)
  }

  findCommissionCount(query, cb) {
    return this.Ledger.count(query, cb);
  }

  /**
   * 
   * @param {String} userId 
   * @param {Number} currentPage 
   * @param {Number} perPage 
   * @param {callback} cb 
   */
  findAdminCommission(userId, filter, currentPage, perPage, cb) {
    let offset = ((currentPage - 1) * perPage);
    let query  = {"userid": userId, "object_type": 'USER'};
    let that   = this;

    if(filter.from && filter.upTo) {
      query["$and"] = [
        {"created_at": {"$gte": filter.from}},
        {"created_at": {"$lt": filter.upTo}}
      ]
    }

    let ledger = this.Ledger.find(query, 'description userid total_amount created_at status').sort({"created_at": -1}).limit(perPage);

    if(offset > 0) {
      ledger = ledger.skip(offset);
    }

    return this.findAdminCommissionSum(userId, (e, r) => {
      let totalCommission = 0;
      if(!e && r && r[0]) {
        totalCommission = r[0].totalCommission;
      }

      return ledger.exec((e, ru) => {
        if(!e) {
          return that.findCommissionCount(query, (er, count) => {
            return cb(false, {"rows": ru, "totalCommission": totalCommission, "count": count});
          });
        }
        else {
          return cb((e || true), "Commission not found.")
        }
      });
    })
  }
}

module.exports = Ledger;
module.exports.getName = () => {
  return 'ledger';
}