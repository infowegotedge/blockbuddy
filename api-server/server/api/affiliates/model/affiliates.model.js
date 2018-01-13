'use strict';

const moment = require('moment');

let padNumber = function(number, padding) {
  let strNumber = '' + number;
  let lenNumber = strNumber.length;
  while(padding > lenNumber) {
    strNumber = '0' + strNumber;
    lenNumber = lenNumber + 1;
  }

  return strNumber;
}

class Affiliates {
  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // affiliate Schema Definition
    let affiliateSchema = new Schema({
      "userid": { type: Object },
      "user_name": { type: String },
      "user_email": { type: String },
      "start_date": { type: Date },
      "end_date": { type: Date },
      "fee": { type: Number },
      "status": { type: String },
      "paid": { type: Number },
      "active": { type: String },
      "invoice_year": { type: String },
      "invoice_no": { type: Number },
      "invoice_status": { type: String },
      "description": { type: String },
      "created_at": { type: Date, "default": Date.now },
      "updated_at": { type: Date, "default": Date.now },
      "deleted_at": { type: Date },
      "pay_through": { type: String },
      "pay_btc": { type: String },
      "currency": { type: String },
      "from_btc_address": { type: String },
      "verified": { type: Boolean },
      "verifyHash": { type: String }
    });

    // Invoice Schema
    let invoiceScheme = new Schema({
      "invoice_year": { type: Number },
      "invoice_count": { type: Number },
    })

    this.Affiliates = connection.model('Affiliate', affiliateSchema);
    this.InvoiceNumber = connection.model('InvoiceNumber', invoiceScheme);
  }

  /**
   * Get Invoice Number
   * @param {Number} userId 
   * @param {callback} cb 
   */
  getInvoiceNo(userId, cb) {
    this.Affiliates.findOne({"userid": userId, "status": {"$ne": "CANCELLED"}, "active": {"$ne": "C"}}, function(e, i) {
      if(!e && i) {
        let endDate = (i.end_date ? moment(i.end_date).valueOf() : 0);
        let newDate = moment().valueOf();
        if(endDate > newDate || endDate === 0) {
          return cb(true, 'Already Affiliated.');
        }
        else {
          return cb(false, 'No affiliation found.');
        }
      }
      else if(!e && !i) {
        return cb(false, 'No affiliation found.');
      }
      else {
        return cb(true, i);
      }
    })
  }

  invoiceNumber(year, cb) {
    return this.InvoiceNumber.findOneAndUpdate({"invoice_year": year}, {"$inc": { "invoice_count" : 1 }}, {"upsert": true}, cb);
  }

  /**
   * 
   * @param {Number} userId 
   * @param {callback} cb 
   */
  invoiceNumberByUserId(userId, cb) {
    let newDate = moment().toISOString();

    return this.Affiliates.count({
      "userid": userId, 
      "status": {"$ne": "CANCELLED"}, 
      "active": {"$ne": "C"}, 
      "$or": [{"end_date": {"$gt": newDate}}, {"end_date": null}, {"end_date": ""}]
    }, cb);
  }

  /**
   * Save Affiliates
   * @param {object} newValue 
   * @param {object} Wallet 
   * @param {callback} cb 
   */
  save(newValue, Wallet, cb) {
    let that              = this;
    let invoiceNo         = moment().format('YYYY');
    newValue.invoice_year = invoiceNo;

    // Get invoice number by user id
    this.invoiceNumberByUserId(newValue.userid, function(e, i) {
      if(!e && i === 0) {
        // Get invoice number
        that.invoiceNumber(invoiceNo, function(e, ic) {
          if(!e) {
            invoiceNo = moment().format('YYYYMMDD') + padNumber(((!ic ? 0 : ic.invoice_count) + 1), 5);
            newValue.invoice_no     = invoiceNo;
            newValue.invoice_status = 'PENDING';
            newValue.status         = 'PENDING';
            newValue.active         = 'N';
            newValue.description    = 'Affiliate Fee';

            if((newValue.pay_through).toLowerCase() === 'bitcoin') {
              let affiliate = new that.Affiliates(newValue);
              return affiliate.save(cb)
            }
            else if((newValue.pay_through).toLowerCase() === 'wallet') {
              newValue.invoice_status = 'COMPLETED';
              newValue.status         = 'COMPLETED';
              newValue.active         = 'Y';
              newValue.start_date     = moment().toISOString();
              newValue.end_date       = moment().add(1, 'years').toISOString();

              // Get Btc Balance
              Wallet.getBtcWallet(newValue.userid, function(e, u) {
                if(!e && u) {
                  // Get Btc Wallet Applied
                  Wallet.getBtcWalletApplied(newValue.userid, function(ew, w) {
                    if(!ew) {
                      let affiliate = new that.Affiliates(newValue);
                      // Save Affiliate
                      return affiliate.save((ea, a) => {
                        if(!ea) {
                          // Update Btc Wallet Applied
                          Wallet.updateBtcWalletApplied(newValue.userid, ((w.btcamount * 1) - (newValue.pay_btc * 1)), (err, we) => {
                            return cb(false, a)
                          });
                        }
                        else {
                          // Update Btc Wallet Applied
                          Wallet.updateBtcWalletApplied(newValue.userid, false, (err, we) => {
                            return cb(true, a)
                          });
                        }
                      });
                    }
                    else {
                      return cb(true, 'Not getting wallet.');
                    }
                  });
                }
                else {
                  return cb(true, 'User balance is not enough.')
                }
              });
            }
          }
          else {
            return cb(true, 'An error occurred, Please try after sometime.')
          }
        });
      }
      else {
        return cb(true, 'Already affiliated.')
      }
    });
  }

  /**
   * Update
   * @param {Number} invoiceNumber 
   * @param {callback} cb 
   */
  update(invoiceNumber, cb) {
    let newValue            = {};
    newValue.start_date     = moment().toISOString();
    newValue.end_date       = moment().add(1, 'years').toISOString();
    newValue.status         = 'COMPLETED';
    newValue.invoice_status = newValue.status;
    newValue.active         = 'Y';
    return this.Affiliates.update({"invoice_no": (invoiceNumber * 1), "status": "PENDING", "invoice_status": "PENDING", "active": "N"}, newValue, cb);
  }

  /**
   * Admin Update
   * @param {String} updateId 
   * @param {String} updateStatus 
   * @param {callback} cb 
   */
  updateByAdmin(updateId, updateStatus, cb) {
    return this.Affiliates.update({"invoice_no": (updateId * 1)}, {"status": updateStatus}, cb)
  }

  /**
   * Update Hash
   * @param {String} userId 
   * @param {Number} invoiceNumber 
   * @param {String} hashString 
   * @param {callback} cb 
   */
  updateHash(userId, invoiceNumber, hashString, cb) {
    let that = this;
    return that.Affiliates.findOne({"userid": userId, "invoice_no": invoiceNumber}, (e, r) => {
      if(!e && r && r.invoice_status === 'PENDING') {
        return that.Affiliates.update(
          {"userid": userId, "invoice_no": (invoiceNumber * 1), "status": "PENDING", "invoice_status": "PENDING", "active": "N"}, 
          {"verifyHash": hashString, "invoice_status": "PROCESSING"}, 
          cb
        );
      }
      else {
        return cb(true, 'You have already specified Hash.');
      }
    });
  }

  /**
   * 
   * @param {object} find 
   * @param {object} update 
   * @param {callback} cb 
   */
  updateVerifyHashTask(find, update, cb) {
    find.status = "PENDING";
    find.invoice_status = "PENDING";
    find.active = "N";

    return this.Affiliates.update(find, update, cb);
  }

  /**
   * 
   * @param {String} userId 
   * @param {number} invoiceNumber 
   * @param {callback} cb 
   */
  updateStatusExpire(userId, invoiceNumber, cb) {
    return this.Affiliates.update({"userid": userId, "invoice_no": (invoiceNumber * 1), "status": "COMPLETED", "invoice_status": "COMPLETED"}, {"status": "EXPIRED", "invoice_status": "EXPIRED"}, cb);
  }

  /**
   * 
   * @param {number} invoiceNumber 
   * @param {callback} cb 
   */
  deleted(invoiceNumber, cb) {
    return this.Affiliates.update({"invoice_no": invoiceNumber, "active": {"$ne": "Y"}}, {"deleted_at": (new Date()).toISOString(), "active": "DELETED"}, cb);
  }

  /**
   * 
   * @param {String} userId 
   * @param {callback} cb 
   */
  list(userId, cb) {
    return this.Affiliates.findOne({"userid": userId}, '-_id start_date end_date invoice_status active invoice_no').sort({"created_at": -1, "_id": -1}).exec(cb);
  }

  /**
   * 
   * @param {String} userId 
   * @param {callback} cb 
   */
  getActiveAffiliateCount(userId, cb) {
    let newDate = moment().toISOString();
    return this.Affiliates.count({"userid": userId, "end_date": {"$gt": newDate}, "status": "COMPLETED", "invoice_status": "COMPLETED", "active": "Y", "verified": true}, cb);
  }

  /**
   * 
   * @param {Date} dateTime
   * @param {callback} cb 
   */
  getTasksList(dateTime, cb) {
    return this.Affiliates.find({"status": "PENDING", "created_at": {"$lte": dateTime}}, cb);
  }

  /**
   * 
   * @param {Date} dateTime
   * @param {callback} cb 
   */
  getCancelTasksList(dateTime, cb) {
    return this.Affiliates.find({"status": "HOLD", "updated_at": {"$lte": dateTime}}, cb);
  }

  /**
   * 
   * @param {Date} dateTime
   * @param {callback} cb 
   */
  getExpireTasksList(dateTime, cb) {
    return this.Affiliates.find({"status": "COMPLETED", "active": "Y", "invoice_status": "COMPLETED", "end_date": {"$lte": dateTime}}, cb);
  }

  /**
   * 
   * @param {String} id
   * @param {Object} data
   * @param {callback} cb 
   */
  updateTask(id, data, cb) {
    return this.Affiliates.update({"_id": id}, data, cb);
  }

  /**
   * 
   * @param {callback} cb 
   */
  getTasksVerifyList(cb) {
    return this.Affiliates.find({"verified": false, "pay_through": "bitcoin", "$or": [{"status": "PENDING"}, {"status": "HOLD"}]}, cb)
  }

  /**
   * 
   * @param {Object} query
   * @param {callback} cb 
   */
  contAffiliation(query, cb) {
    return this.Affiliates.count(query, cb)
  }

  /**
   * 
   * @param {Object} filter
   * @param {Number} curPage
   * @param {Number} perPage
   * @param {callback} cb 
   */
  findAffiliation(filter, curPage, perPage, cb) {
    let offset = ((curPage - 1) * perPage);
    let query  = {"status": "COMPLETED"};
    let that   = this;

    if(filter.from) {
      query['$and'] = [{"created_at": {"$gt": filter.from}}, {"created_at": {"$lte": filter.upTo}}];
    }
    
    let affiliates = this.Affiliates.find(query).sort({"created_at": -1}).limit(perPage);

    if(offset > 0) {
      affiliates = affiliates.skip(offset);
    }

    affiliates.exec(function(e, a) {
      if(!e) {
        return that.contAffiliation(query, (er, count) => {
          return cb(false, {"affiliates": a, count: (!er && count ? count : 0)});
        });
      }
      else {
        return cb(true, 'No affiliation found');
      }
    });
  }

  /**
   * 
   * @param {Object} filter
   * @param {Number} curPage
   * @param {Number} perPage
   * @param {callback} cb 
   */
  findAffiliationAdmin(filter, curPage, perPage, cb) {
    let offset = ((curPage - 1) * perPage);
    let query  = {"status": "COMPLETED"};
    let that   = this;

    if(filter && filter.status) {
      switch(filter.status.toLowerCase()) {
        case 'pending':
          query['status'] = 'PENDING';
          break;
        case 'processing':
          query['status'] = 'PROCESSING';
          break;
        case 'hold':
          query['status'] = 'HOLD';
          break;
      }
    }

    if(filter && filter.from) {
      query['$and'] = [{"created_at": {"$gt": filter.from}}, {"created_at": {"$lte": filter.upTo}}];
    }
    
    let affiliates = this.Affiliates.find(query).sort({"created_at": -1}).limit(perPage);

    if(offset > 0) {
      affiliates = affiliates.skip(offset);
    }

    affiliates.exec(function(e, a) {
      if(!e) {
        return that.contAffiliation(query, (er, count) => {
          return cb(false, {"affiliates": a, count: (!er && count ? count : 0)});
        });
      }
      else {
        return cb(true, 'No affiliation found');
      }
    });
  }
}

module.exports = Affiliates;
module.exports.getName = () => {
  return 'affiliates';
}