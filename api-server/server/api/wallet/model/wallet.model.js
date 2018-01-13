'use strict';

// const crypt = require('crypto')
const moment = require('moment');

class Wallet {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // BTC Wallet Schema Definition
    let walletSchema = new Schema({
      "userid": { type: Object },
      "btcaddress": { type: String },
      "btcamount": { type: Number },
      "usdamount": { type: Number },
      "status": { type: String }
    });

    // Withdrawal Schema
    let withdrawalSchema = new Schema({
      "userid": { type: Object },
      "btc_address": { type: String },
      "amount_withdrawal": { type: Number },
      "amount_fee": { type: Number },
      "amount": { type: Number },
      "status": { type: String },
      "timestamp": { type: Number, "default": Date.now },
      "created_at": { type: Date, "default": Date.now },
      "updated_at": { type: Date },
      "auto_withdraw": { type: Boolean },
      "user_name": { type: String },
      "transaction_hash": { type: String },
      "transaction_fee": { type: String },
      "transaction_amount": { type: Number },
      "transaction_status": { type: String },
      "transaction_btc": { type: String },
      "admin_comments": { type: String },
      "color_status": { type: String, "default": 'N' }
    });

    // Transfer Schema
    let transferSchema = new Schema({
      "userid": { type: Object },
      "to_userid": { type: Object },
      "amount_transfer": { type: Number },
      "amount_fee": { type: Number },
      "amount": { type: Number },
      "status": { type: String },
      "timestamp": { type: Number, "default": Date.now },
      "created_at": { type: Date, "default": Date.now },
      "updated_at": { type: Date },
      "sign": { type: String },
      "transfer_type_name": { type: String, "default": '' },
      "transfer_type_id": { type: String, "default": '' } 
    });

    walletSchema.index({created_at: 1, auto_withdraw: 1, btcaddress: 1, userid: 1, _id: 1}, {unique: true});
    this.Wallet = connection.model('Wallet', walletSchema);

    withdrawalSchema.index({created_at: 1, userid: 1, btc_address: 1, status: 1, amount_withdrawal: 1, amount: 1});
    this.Withdrawal = connection.model('Withdrawal', withdrawalSchema);

    transferSchema.index({created_at: 1, userid: 1, to_userid: 1, status: 1, amount_withdrawal: 1, amount: 1});
    this.Transfer = connection.model('Transfer', transferSchema);
  }

  /**
   * 
   * @param {String} withdrawalId 
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  updateWithdrawal(withdrawalId, Ledger, newValue, cb) {
    let that = this;

    if(newValue.status == 'COMPLETED') {
      newValue.color_status = 'C';
    } else if(newValue.status == 'REJECTED') {
      newValue.color_status = 'R';
    } else {
      newValue.color_status = 'N';
    }

    return this.Withdrawal.update({"_id": withdrawalId}, newValue, (e, w) => {
      return Ledger.update({"object_id": withdrawalId, "object_type": "WITHDRAWAL"}, {"status": newValue.status}, (el, l) => {
        return cb(e, w);
      })
    });
  }

  /**
   * 
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  updateWithdrawalAdmin(newValue, cb) {
    let query = {"_id": newValue.id, "amount": newValue.amount, "status": 'PENDING', 'color_status': 'N'};
    return this.Withdrawal.update(query, newValue, cb);
  }

  /**
   * 
   * @param {String} id 
   * @param {callback} cb 
   */
  findWithdrawalById(id, cb) {
    return this.Withdrawal.findOne({"_id": id}, cb);
  }

  /**
   * 
   * @param {String} userId
   * @param {String} btcAddress
   * @param {Number} amounts
   * @param {callback} cb 
   */
  createBtcWallet(userId, btcAddress, amounts, cb) {
    let wallet = this.Wallet({"btcaddress": btcAddress, "userid": userId, "btcamount": amounts.btcAmount, "usdamount": amounts.amount, "status": "APPLIED"});
    let that   = this;
    that.Wallet.findOne({"btcaddress": btcAddress, "userid": userId}, function(e, u) {
      if(!e && !u) {
        return wallet.save(cb);
      }
      else {
        return cb((e || true), 'Wallet was found');
      }
    });
  }

  /**
   * 
   * @param {String} userId
   * @param {String} btcAddress
   * @param {callback} cb 
   */
  updateBtcWallet(userId, btcAddress, cb) {
    let that = this;
    that.Wallet.findOne({"btcaddress": btcAddress, "userid": {"$ne": userId}}, function(e, u) {
      if(!e && !u) {
        that.Wallet.findOne({"userid": userId}, function(_e, _u) {
          if(!_e && _u) {
            return _u.update({"btcaddress": btcAddress}, cb);
          }
          else {
            return cb((_e || true), 'BTC Wallet was empty')
          }
        });
      }
      else {
        return cb((e || true), 'BTC Wallet was found');
      }
    });
  }

  /**
   * 
   * @param {Object} query
   * @param {callback} cb 
   */
  newWalletCount(cb) {
    return this.Withdrawal.count({'$or': [{'color_status': 'N'}, {'color_status': null}], '$or': [{'status':'PENDING'}, {'status': 'PROCESSING'}]}, cb);
  }

  /**
   * 
   * @param {Object} query
   * @param {callback} cb 
   */
  findWalletCount(query, cb) {
    return this.Withdrawal.count(query, cb);
  }

  /**
   * 
   * @param {Object} filter 
   * @param {Number} currentPage 
   * @param {Number} perPage
   * @param {callback} cb 
   */
  findWallet(filter, currentPage, perPage, cb) {
    let offset = (perPage * (currentPage - 1));
    let query  = {'status': 'PENDING'};
    let that   = this;

    if(filter.status) {
      switch(filter.status.toLowerCase()) {
        case 'hold': 
          query.status = 'HOLD';
          break;
        case 'completed':
          query.status = 'COMPLETED';
          break;
        case 'processing':
          query.status = 'PROCESSING';
          break;
        case 'rejected':
          query.status = 'REJECTED';
          break;
      }
    }

    if(filter.autoWithdraw) {
      query.auto_withdraw = (filter.autoWithdraw || false);
    }

    if(filter.userId) {
      query.userid = filter.userId+'';
    }

    if(filter.minTime && filter.maxTime) {
      query["$and"] = [{"created_at": {"$gte": filter.minTime}}, {"created_at": {"$lt": filter.maxTime}}];
    }

    let withdrawal = that.Withdrawal.find(query).sort({"created_at": -1}).limit(perPage);
    if(offset !== 0) {
      withdrawal = withdrawal.skip(offset);
    }

    withdrawal.exec(function(e, b) {
      if(!e) {
        return that.findWalletCount(query, (er, count) => {
          return cb(false, {"withdrawals": b, count: (!er && count ? count : 0)});
        });
      }
      else {
        return cb(true, 'No withdrawal found');
      }
    })
  }

  /**
   * 
   * @param {Number} currentPage 
   * @param {Number} perPage
   * @param {callback} cb 
   */
  findWalletUser(userId, currentPage, perPage, cb) {
    let offset = (perPage * (currentPage - 1));
    let query  = {'userid': userId};
    let that   = this;

    let withdrawal = that.Withdrawal.find(query, '-_id user_name amount_withdrawal created_at').sort({"created_at": -1}).limit(perPage);
    if(offset !== 0) {
      withdrawal = withdrawal.skip(offset);
    }

    withdrawal.exec(function(e, b) {
      if(!e) {
        return cb(false, {"withdrawals": b});
      }
      else {
        return cb(true, 'No withdrawal found');
      }
    })
  }

  /**
   * 
   * @param {Number} currentPage 
   * @param {Number} perPage
   * @param {callback} cb 
   */
  findAdminWalletUser(currentPage, perPage, cb) {
    let offset = (perPage * (currentPage - 1));
    let query  = {'status': 'PENDING'};
    let that   = this;

    let withdrawal = that.Withdrawal.find(query, '-_id user_name amount_withdrawal created_at').sort({"created_at": -1}).limit(perPage);
    if(offset !== 0) {
      withdrawal = withdrawal.skip(offset);
    }

    withdrawal.exec(function(e, b) {
      if(!e) {
        return cb(false, {"withdrawals": b});
      }
      else {
        return cb(true, 'No withdrawal found');
      }
    })
  }

  /**
   * 
   * @param {callback} cb 
   */
  findTotalWithdrawalFee(cb) {
    let query  = {'status': 'COMPLETED'};
    this.Withdrawal.aggregate([
      {"$match": query},
      {"$group": { "_id": null, totalAmountWithFee: {"$sum": "$amount"}, totalAmount: {"$sum": "$amount_withdrawal"} }}
    ], (e, r) => {
      let feeAmount = 0
      if(!e && r && r.length > 0) {
        feeAmount = (r[0].totalAmountWithFee - r[0].totalAmount);
      }

      return cb(false, feeAmount);
    })
  }

  /**
   * 
   * @param {Object} filter 
   * @param {Number} currentPage 
   * @param {Number} perPage
   * @param {callback} cb 
   */
  findWalletFee(filter, currentPage, perPage, cb) {
    let offset = (perPage * (currentPage - 1));
    let query  = {'status': 'COMPLETED'};
    let that   = this;

    if(filter.from) {
      query['$and'] = [{'created_at': {"$gt": filter.from}}, {'created_at': {"$lte": filter.upTo}}];
    }
    
    let withdrawal = that.Withdrawal.find(query).sort({"created_at": -1}).limit(perPage);
    if(offset !== 0) {
      withdrawal = withdrawal.skip(offset);
    }

    withdrawal.exec(function(e, b) {
      if(!e) {
        return that.findWalletCount(query, (er, count) => {
          return that.findTotalWithdrawalFee((error, feeAmount) => {
            return cb(false, {"withdrawals": b, "count": (!er && count ? count : 0), "totalFee": feeAmount});
          });
        });
      }
      else {
        return cb(true, 'No withdrawal found');
      }
    })
  }

  /**
   * 
   * @param {callback} cb 
   */
  findWithdrawalSum(cb) {
    return this.Withdrawal.aggregate([
      {"$group": {"_id": "$status", "sumWithdrawalFee": {"$sum": "$amount_fee"}}}
    ], cb)
  }

  /**
   * 
   * @param {String} userId 
   * @param {String} btcAddress
   * @param {callback} cb 
   */
  getWallet(userId, btcAddress, cb) {
    return this.Wallet.find({"$or": [{"userid": userId}, {"btcaddress": btcAddress}]}, cb)
  }

  /**
   * 
   * @param {String} userId 
   * @param {callback} cb 
   */
  getBtcWallet(userId, cb) {
    return this.Wallet.findOne({"userid": userId}, '-_id btcaddress btcamount', cb)
  }

  /**
   * 
   * @param {String} userId 
   * @param {callback} cb 
   */
  getBtcWalletApplied(userId, cb) {
    return this.Wallet.findOneAndUpdate({"userid": userId, "status": 'APPLIED'},
      {"$set": {"status": 'PENDING'}}, 
      {"upsert": false, returnNewDocument : true}, cb);
  }

  /**
   * 
   * @param {String} userId 
   * @param {Number} amount
   * @param {callback} cb 
   */
  updateBtcWalletApplied(userId, amount, cb) {
    let updateValue = null;

    if(amount) {
      updateValue = {"$set": {"status": 'APPLIED', "btcamount": amount}}
    }
    else {
      updateValue = {"$set": {"status": 'APPLIED'}}
    }

    this.Wallet.findOneAndUpdate({"userid": userId, "status": 'PENDING'},
      updateValue, {"upsert": false, returnNewDocument : true}, cb);
  }

  /**
   * 
   * @param {String} userId
   * @param {callback} cb 
   */
  getUSDWallet(userId, cb) {
    return this.Wallet.findOne({"userid": userId}, '-_id usdamount', cb)
  }

  /**
   * 
   * @param {callback} cb 
   */
  getAutoWithdrawal(cb) {
    let newDate = moment().subtract(2, 'hours').toISOString();
    return this.Withdrawal.find({"created_at": {"$lte": newDate}, "auto_withdraw": true, "status": "PENDING"}, cb);
  }

  /**
   * 
   * @param {callback} cb 
   */
  getAutoWithdrawalProcessingList(cb) {
    return this.Withdrawal.find({"auto_withdraw": true, "status": "PROCESSING"}, cb);
  }

  /**
   * 
   * @param {String} userId 
   * @param {Object} newValue
   * @param {Object} Ledger 
   * @param {callback} cb 
   */ 
  withdrawalAmount(userId, newValue, Ledger, cb) {
    let that = this;
    return that.getBtcWalletApplied(userId, (e, w) => {
      if(!e && !w) {
        return cb(true, 'Wallet not found.');
      }
      else if(e) {
        return cb(true, w);
      }
      else {
        if((w.btcamount * 1) >= (newValue.amount * 1)) {
          newValue.btc_address = w.btcaddress;
          newValue.userid = userId;
          newValue.color_status = 'N';

          let updateValue = ((w.btcamount * 1) - (newValue.amount * 1));
          let errorValue  = false;
          let withdrawal  = new that.Withdrawal(newValue);

          return withdrawal.save((ew, wi) => {
            if(ew || !wi) {
              updateValue = (w.btcamount * 1);
              errorValue  = true;

              return that.updateBtcWalletApplied(userId, updateValue, (eu, wu) => {
                return cb(errorValue, wi);
              });
            }
            else {
              return Ledger.save({
                "userid": withdrawal.userid,
                "amount": withdrawal.amount_withdrawal,
                "fee": withdrawal.amount_fee,
                "status": withdrawal.status,
                "total_amount": withdrawal.amount,
                "object_id": withdrawal._id,
                "object_type": "WITHDRAWAL",
                "account_id": withdrawal.btc_address,
                "description": "Withdraw amount",
                "sign": "-"
              }, (el, l) => {
                return that.updateBtcWalletApplied(userId, updateValue, (eu, wu) => {
                  return cb(errorValue, wi);
                });
              });
            }
          });
        }
        else {
          return that.updateBtcWalletApplied(userId, false, (eu, wu) => {
            return cb(true, 'Not enough BTC balance.')
          });
        }
      }
    });
  }

  /**
   *  
   * @param {Object} query 
   * @param {callback} cb 
   */
  findTransferCount(query, cb) {
    return this.Transfer.count(query, cb);
  }

  /**
   * 
   * @param {callback} cb 
   */
  findTransferSum(cb) {
    return this.Transfer.aggregate([
      {"$match": {'sign': '-'}},
      {"$group": {"_id": "$status", "sumTransferFee": {"$sum": "$amount_fee"}}}
    ], cb)
  }

  /**
   *  
   * @param {Object} filter
   * @param {Number} currentPage 
   * @param {Number} perPage 
   * @param {callback} cb 
   */
  findTransfer(filter, currentPage, perPage, cb) {
    let offset = (perPage * (currentPage - 1));
    let query  = {'sign': '-', 'status': 'COMPLETED'};
    let that   = this;

    if(filter.status) {
      switch(filter.status.toLowerCase()) {
        case 'hold': 
          query.status = 'HOLD';
          break;
        case 'pending':
          query.status = 'PENDING';
          break;
        case 'processing':
          query.status = 'PROCESSING';
          break;
      }
    }

    if(filter.userId) {
      query['$or'] = [{'to_userid': filter.userId+''}, {'userid': filter.userId+''}];
    }

    let transfer = that.Transfer.find(query).sort({"created_at": -1}).limit(perPage);
    if(offset !== 0) {
      transfer = transfer.skip(offset);
    }

    transfer.exec(function(e, b) {
      if(!e) {
        return that.findTransferCount(query, (er, count) => {
          return cb(false, {"transfers": b, count: (!er && count ? count : 0)});
        });
      }
      else {
        return cb(true, 'No transfers found');
      }
    })
  }

  /**
   * 
   * @param {callback} cb 
   */
  findTotalTransferFee(cb) {
    let query  = {'sign': '-', 'status': 'COMPLETED'};
    this.Transfer.aggregate([
      {"$match": query},
      {"$group": { "_id": null, totalAmountWithFee: {"$sum": "$amount"}, totalAmount: {"$sum": "$amount_transfer"} }}
    ], (e, r) => {
      let feeAmount = 0
      if(!e && r && r.length > 0) {
        feeAmount = (r[0].totalAmountWithFee - r[0].totalAmount);
      }

      return cb(false, feeAmount);
    })
  }

  /**
   *  
   * @param {Object} filter
   * @param {Number} currentPage 
   * @param {Number} perPage 
   * @param {callback} cb 
   */
  findTransferFee(filter, currentPage, perPage, cb) {
    let offset = (perPage * (currentPage - 1));
    let query  = {'sign': '-', 'status': 'COMPLETED'};
    let that   = this;

    if(filter.from) {
      query['$and'] = [{'created_at': {"$gt": filter.from}}, {'created_at': {"$lte": filter.upTo}}];
    }

    let transfer = that.Transfer.find(query).sort({"created_at": -1}).limit(perPage);
    if(offset !== 0) {
      transfer = transfer.skip(offset);
    }

    transfer.exec(function(e, b) {
      if(!e) {
        return that.findTransferCount(query, (er, count) => {
          return that.findTotalTransferFee((error, feeAmount) => {
            return cb(false, {"transfers": b, "count": (!er && count ? count : 0), "totalFee": feeAmount});
          })
        });
      }
      else {
        return cb(true, 'No transfers found');
      }
    })
  }

  /**
   *  
   * @param {String} userId
   * @param {String} toUserId
   * @param {callback} cb 
   */
  getBtcTransferWalletApplied(userId, toUserId, cb) {
    return this.Wallet.findOneAndUpdate(
      {"userid": userId, "status": 'APPLIED'},
      {"$set": {"status": 'PENDING'}}, 
      {"upsert": false}, (e, w) => {
        
        return this.Wallet.findOneAndUpdate(
          {"userid": toUserId+'', "status": 'APPLIED'},
          {"$set": {"status": 'PENDING'}}, 
          {"upsert": false}, (e1, w1) => {

            return cb((e || e1), {"wallet1": w, "wallet2": w1})
        });
    });
  }

  /**
   *  
   * @param {String} userId
   * @param {String} toUserId
   * @param {Number} amount
   * @param {Number} toAmount
   * @param {callback} cb 
   */
  updateBtcTransferWalletApplied(userId, toUserId, amount, toAmount, cb) {
    let that         = this;
    let updateValue  = {"$set": {"status": 'APPLIED', "btcamount": amount}}
    let updateValue2 = {"$set": {"status": 'APPLIED', "btcamount": toAmount}};

    if(amount === false) {
      updateValue  = {"$set": {"status": 'APPLIED'}};
    }

    if(toAmount === false) {
      updateValue2 = {"$set": {"status": 'APPLIED'}};
    }

    return that.Wallet.findOneAndUpdate({"userid": userId, "status": 'PENDING'},
      updateValue, {"upsert": false, returnNewDocument : true}, (e, u) => {

        return that.Wallet.findOneAndUpdate({"userid": toUserId+'', "status": 'PENDING'},
          updateValue2, {"upsert": false, returnNewDocument : true}, (e1, u1) => {
            return cb((e||e1), (u||u1));
        });
    });
  }

  /**
   *  
   * @param {String} userId
   * @param {callback} cb 
   */
  sumDayTransfer(userId, cb) {
    let dayDate  = moment().toISOString();
    let lastDate = moment().subtract(1, 'days').valueOf();

    return this.Transfer.aggregate([
      {"$match": {"userid": userId, "status": "COMPLETED", "timestamp": {"$gt": lastDate}}},
      {"$group": {"_id": "$transfer_type_id", "total": {"$sum": "$amount"}}},
    ], cb)
  }

  /**
   *  
   * @param {String} userId
   * @param {String} toUserId
   * @param {Object} newValue
   * @param {Object} Ledger
   * @param {callback} cb 
   */
  transferAmount(userId, toUserId, toUsername, fromUsername, newValue, Ledger, cb) {
    let that = this;
    return that.getBtcTransferWalletApplied(userId, toUserId, (e, w) => {
      if(!e && (!w.wallet1 || !w.wallet2)) {
        return that.updateBtcTransferWalletApplied(userId, toUserId, false, false, (eu, wu) => {
          console.log(eu, wu);
          return cb(true, 'Wallet not found.');
        });
      }
      else if(e) {
        return cb(true, 'Unable to obtain lock on wallet.');
      }
      else {
        if(w.wallet1 && (w.wallet1.btcamount * 1) >= (newValue.amount * 1)) {
          let newValue1        = Object.assign({}, newValue);
          newValue.to_userid  = toUserId+'';
          newValue.userid     = userId+'';
          newValue.sign       = "-";
          newValue1.to_userid = userId+'';
          newValue1.userid    = toUserId+'';
          newValue1.sign      = "+";
          let updateValue     = ((w.wallet1.btcamount * 1) - (newValue.amount * 1));
          let updateValue2    = (((w.wallet2.btcamount ? w.wallet2.btcamount : 0) * 1) + (newValue.amount_transfer * 1));
          let errorValue      = false;
          let transfer        = new that.Transfer(newValue);
          let transfer1       = new that.Transfer(newValue1);

          SaveTransfer(transfer, transfer1, (e, m) => {
            if(e) {
              return that.updateBtcTransferWalletApplied(userId, toUserId, false, false, (eu, wu) => {
                return cb(true, 'Not enough BTC balance.')
              });
            }
            else {
              let saveLedger  = {
                "userid": transfer.userid, "amount": transfer.amount_transfer,
                "fee": transfer.amount_fee, "status": transfer.status,
                "total_amount": transfer.amount, "object_id": transfer._id,
                "object_type": "TRANSFER", "account_id": toUserId,
                "description": "Transfer amount ( " + toUsername + " )", "sign": "-"
              };
              let saveLedger1 = {
                "userid": toUserId+'', "amount": transfer.amount_transfer,
                "fee": 0, "status": transfer.status,
                "total_amount": transfer.amount_transfer, "object_id": transfer1._id,
                "object_type": "RECEIVE", "account_id": transfer.userid,
                "description": "Receive amount ( " + fromUsername + " )", "sign": "+"
              };

              return Ledger.multiSave(saveLedger, saveLedger1, (el, l) => {
                return that.updateBtcTransferWalletApplied(userId, toUserId, updateValue, updateValue2, (eu, wu) => {
                  return cb(errorValue, m);
                });
              });
            }
          });
        }
        else {
          return that.updateBtcTransferWalletApplied(userId, toUserId, false, false, (eu, wu) => {
            console.log(eu, wu);
            return cb(true, 'Not enough BTC balance.')
          });
        }
      }
    });
  }

  /**
   *  
   * @param {String} userId
   * @param {String} toUserId
   * @param {Object} newValue
   * @param {Object} Ledger
   * @param {Object} product
   * @param {callback} cb 
   */
  transferProductAmount(userId, toUserId, toUsername, fromUsername, newValue, product, Ledger, cb) {
    let that = this;
    let newValue1       = Object.assign({}, newValue);
    newValue.to_userid  = toUserId+'';
    newValue.userid     = userId+'';
    newValue.sign       = "-";
    newValue1.to_userid = userId+'';
    newValue1.userid    = toUserId+'';
    newValue1.sign      = "+";
    let errorValue      = false;
    let transfer        = new that.Transfer(newValue);
    let transfer1       = new that.Transfer(newValue1);

    SaveTransfer(transfer, transfer1, (e, m) => {
      if(e) {
        return cb(true, 'Not enough Product balance.')
      }
      else {
        let saveLedger  = {
          "userid": transfer.userid, "amount": transfer.amount_transfer,
          "fee": transfer.amount_fee, "status": transfer.status,
          "total_amount": transfer.amount, "object_id": transfer._id,
          "object_type": "PRODUCT", "account_id": toUserId,
          "description": "Transfer " + product.name + " ( " + toUsername + " )", "sign": "-",
          "actual_id": (product._id + ''), "sign_amount": -transfer.amount
        };
        let saveLedger1 = {
          "userid": toUserId+'', "amount": transfer.amount_transfer,
          "fee": 0, "status": transfer.status,
          "total_amount": transfer.amount_transfer, "object_id": transfer1._id,
          "object_type": "PRODUCT", "account_id": transfer.userid,
          "description": "Receive " + product.name + " ( " + fromUsername + " )", "sign": "+",
          "actual_id": (product._id + ''), "sign_amount": transfer.amount_transfer
        };

        return Ledger.multiSave(saveLedger, saveLedger1, (el, l) => {
          return cb(e, m);
        });
      }
    });
  }
}

/**
 *  
 * @param {Object} transfer
 * @param {Object} transfer1
 * @param {callback} cb 
 */
let SaveTransfer = function SaveTransfer(transfer, transfer1, cb) {
  return transfer.save((ew, wi) => {
    if(ew || !wi) {
      return cb(true, 'Not save');
    }
    else {
      return transfer1.save((ew1, wi1) => {
        if(ew1 || !wi1) {
          return wi.remove((er, wr) => {
            return cb(true, 'Not save.')
          });
        }
        else {
          return cb(false, 'Transfer saved successfully.')
        }
      });
    }
  });
}

module.exports = Wallet;
module.exports.getName = () => {
  return 'wallet';
}