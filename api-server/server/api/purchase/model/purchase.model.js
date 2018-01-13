'use strict';

let Binary = require('./../../../component/neo4j_db');

class Purchase {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;
    
    // Purchase Schmea Definition
    let purchaseSchema = new Schema({
      userid: { type: Object },
      name: { type: String },
      qunitity: { type: Number },
      price: { type: Number },
      amount: { type: Number },
      status: { type: String },
      created_at: { type: Date, "default": Date.now },
      updated_at: { type: Date }
    });

    // Commission Schema
    let commissionSchema = new Schema({
      purchaseid: { type: Object },
      userid: { type: Object },
      username: { type: String },
      sponsorid: { type: Object },
      sponsorname: { type: String },
      name: { type: String },
      percentage: { type: Number },
      amount: { type: Number },
      created_at: { type: Date, "default": Date.now },
      updated_at: { type: Date },
      status: { type: String }
    });

    // Purchase Info Schema
    let allPurchaseInfoSchema = new Schema({
      userid: { type: Object },
      hpos: { type: Number },
      item_name: { type: String },
      doj: { type: Date },
      sponsor: { type: String },
      left_count: { type: Number },
      right_count: { type: Number },
      left_pv_count: { type: Number },
      right_pv_count: { type: Number },
      total_direct: { type: Number },
      virtual_pairs: { type: Number },
      balance_pv: { type: Number },
      carry_forward: { type: Number },
      repurchase: { type: Boolean }
    });

    // All Purchase Info Schema
    let purchaseInfoSchema = new Schema({
      userid: { type: Object },
      pv_purchased: {type: Number },
      status: { type: String },
      repurchase: { type: Boolean }
    });

    // Rates Schema
    let currentRatesSchema = new Schema({
      unit: { type: String },
      price_btc: { type: Number },
      price_usd: { type: Number },
      active: { type: Boolean },
      active_date: { type: Date },
      non_active_date: { type: Date }
    })

    this.Purchase = connection.model('Purchases', purchaseSchema);
    this.CommissionPurchase = connection.model('CommissionPurchase', commissionSchema);
    this.AllPurchaseInfo = connection.model('AllPurchaseInfo', allPurchaseInfoSchema);
    this.PurchaseInfo = connection.model('PurchaseInfo', purchaseInfoSchema);
    this.CurrentRates = connection.model('CurrentRates', currentRatesSchema);
  }

  // Get Purchase Object
  getAllPurchaseInfo() {
    return this.AllPurchaseInfo;
  }

  // Get Purchase Info Object
  getPurchaseInfo() {
    return this.PurchaseInfo;
  }

  /**
   * 
   * @param {callback} cb 
   */
  findAllPurchases(cb) {
    let purchase = this.AllPurchaseInfo.find({}).sort({'_id': 1})
    purchase.exec(function(e, a) {
      if(e) {
        return cb(true, 'Member not found');
      }
      return cb(false, a);
    });
  }

  /**
   * 
   * @param {String} memberID
   * @param {callback} cb 
   */
  findAllPurchase(memberId, cb) {
    this.AllPurchaseInfo.findOne({"userid": memberId}, function(e, a) {
      if(e) {
        return cb(true, 'Member not found');
      }
      return cb(false, a);
    })
  }

  /**
   * 
   * @param {Object} newValue
   * @param {callback} cb 
   */
  saveAllPurchase(newValue, cb) {
    let that = this;
    that.findAllPurchase(newValue.userid, function(e, allp) {
      if(!allp) {
        let allPurchase = new that.AllPurchaseInfo(newValue);
        allPurchase.save(cb);
      }
      else {
        allp.update({
          "left_pv_count": newValue.left_pv_count,
          "right_pv_count": newValue.right_pv_count,
          "left_count": newValue.left_count,
          "right_count": newValue.right_count
        }, cb);
      }
    })
  }

  /**
   * 
   * @param {Object} newValue
   * @param {Object} purchaseInfo
   * @param {callback} cb 
   */
  save(newValue, purchaseInfo, cb) {
    let that            = this;
    let createdAt       = (new Date()).toISOString();
    newValue.created_at = createdAt;
    newValue.updated_at = createdAt;
    let purchaseIfno    = {
      "userid": newValue.userid,
      "pv_purchased": purchaseInfo.pv,
      "status": "PENDING",
      "repurchase": false
    };

    that.findPurchase(newValue.userid, function(e, pur) {
      if(!e) {
        purchaseIfno["repurchase"] = true;
      }

      let purchase = new that.Purchase(newValue);
      let pInfo    = new that.PurchaseInfo(purchaseIfno);

      Binary.updatePV(newValue.userid, purchaseInfo.pv, function(eb, p) {
        if(eb) {
          return cb(true, 'Purchase info is not saved');
        }

        pInfo.save(function(ep, pi) {
          if(ep) {
            return cb(true, 'Purchase info is not saved')
          }

          purchase.save(function(eps, p) {
            return cb(eps, {'purchase': p, 'addBinaryCalculation': e});
          });
        });
      });
    });
  }

  /**
   * 
   * @param {String} findValue
   * @param {callback} cb 
   */
  find(findValue, cb) {
    this.Purchase.find({'userid': findValue}, function(e, c) {
      if(!e && (!c || !c[0])) {
        return cb(false, c)
      }
      return cb(true, e);
    });
  }

  /**
   * 
   * @param {String} userid
   * @param {callback} cb 
   */
  findPurchase(userid, cb) {
    this.Purchase.findOne({'userid': userid}).sort({'_id': 1}).exec(function(e, p) {
      if(!e && p) {
        return cb(false, p)
      }
      return cb(true, 'Purchase not found');
    });
  }

  /**
   * 
   * @param {String} userid
   * @param {String} purchaseId
   * @param {callback} cb 
   */
  findPurchaseById(userId, purchaseId, cb) {
    console.log(userId, purchaseId);
    this.Purchase.findOne({'userid': userId, '_id': purchaseId}, function(e, p) {
      if(!e && p) {
        return cb(false, p)
      }
      return cb(true, 'Purchase not found');
    });
  }

  /**
   * 
   * @param {Object} query 
   * @param {callback} cb 
   */
  countDirectCommission(query, cb) {
    return this.CommissionPurchase.count(query, cb);
  }

  /**
   * 
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  saveCommission(newValue, cb) {
    let createdAt       = (new Date()).toISOString();
    newValue.created_at = createdAt;
    newValue.updated_at = createdAt;
    let commission      = new this.CommissionPurchase(newValue);

    commission.save(cb);
  }

  /**
   * 
   * @param {String} userId 
   * @param {Number} curPage 
   * @param {Number} perPage 
   * @param {callback} cb 
   */
  findDirectCommission(userId, curPage, perPage, cb) {
    let offset = ((curPage - 1) * perPage);
    let query  = {'userid': userId};
    let that   = this;

    let commission = this.CommissionPurchase.find(query).sort({"created_at": -1}).limit(perPage);

    if(offset !== 0) {
      commission = commission.skip(offset);
    }

    commission.exec(function(e, c) {
      if(!e) {
        return that.countDirectCommission(query, (er, count) => {
          return cb(false, {"commissions": c, count: (!er && count ? count : 0)});
        });
      }
      else {
        return cb(true, 'No commissions found');
      }
    });
  }

  /**
   * 
   * @param {Object} newValue 
   * @param {String} userId 
   * @param {callback} cb 
   */
  saveAllPurchaseInfo(newValue, userId, cb) {
    let allPurchaseInfo = new this.AllPurchaseInfo(newValue);
    allPurchaseInfo.save(cb);
  }

  /**
   * 
   * @param {String} userIds 
   * @param {callback} cb 
   */
  getAllPurchaseInfo(userIds, cb) {
    return this.AllPurchaseInfo.find({"userid": {"$in": userIds}}, '-_id userid left_pv_count right_pv_count left_count right_count', cb)
  }

  /**
   * 
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  saveCurrentRates(newValue, cb) {
    let that = this;

    this.CurrentRates.update({"active": true, "unit": newValue.unit}, {"active": false, "non_active_date": new Date()}, function(e, cr) {
      if(e) {
        return cb(true, e);
      }

      newValue.active_date = new Date();
      newValue.active      = true;
      let currentRates     = new that.CurrentRates(newValue);
      return currentRates.save(cb);
    });
  }

  /**
   * 
   * @param {callback} cb 
   */
  findCurrentRates(cb) {
    return this.CurrentRates.findOne({"active": 1}, '-_id unit price_btc price_usd', cb);
  }
}

module.exports = Purchase;
module.exports.getName = () => {
  return 'purchase';
}
