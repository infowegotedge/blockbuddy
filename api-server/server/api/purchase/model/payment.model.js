'use strict';

// let Binary = require('./../../../component/neo4j_db');

class Payment {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // Payment Schema Definition
    let paymentSchema = new Schema({
      userid: { type: Object },
      name: { type: String },
      quantity: { type: Number },
      product_id: { type: String },
      product_name: { type: String },
      price: { type: Number },
      amount: { type: Number },
      amount_fee: { type: Number },
      fee_amount: { type: Number, "default": 0 },
      status: { type: String },
      address: { type: String },
      invoice: { type: String },
      purchase_id: { type: Object },
      order_id: { type: String },
      created_at: { type: Date, "default": Date.now },
      updated_at: { type: Date },
      payment_type: { type: String },
      payment_types: { type: Number },
      transaction_id: { type: String },
      btc_amount: { type: Number },
      status_url: { type: String },
      qrcode_url: { type: String },
      approved_date: { type: Date },
      notes: { type: String, "default": "" },
      gateway_status: { type: String, "default": "PROCESSING" },
      color_status: { type: String, "default": 'N' }
    });

    // Product Schema Definition
    let productsSchema = new Schema({
      user_id: { type: Object },
      name: { type: String },
      value: { type: Number },
      currency_code: { type: String },
      product_type: { type: String },
      product_belongs: { type: String }, 
      amount: { type: Number },
      shares: { type: Number },
      after_three_month: { type: Number },
      after_three_month_string: { type: String },
      receive_20p_points_monthly_shares_block_evolution_shares: { type: Boolean, "default": false },
      can_trade: { type: Boolean, "default": false },
      receive_affiliate_commissions: { type: Boolean, "default": false },
      receive_coins_from_index_buying: { type: Boolean, "default": false },
      receive_coins_from_the_social_commerce_pool: { type: Boolean, "default": false },
      receive_50p_points_in_monthly_shares_block_evolution_shares: { type: Boolean, "default": false },
      includes_yazzer_membership_including_jet_and_yacht_points: { type: Boolean, "default": false },
      receive_coins_from_index_buying_convert_yazzer: { type: Boolean, "default": false },
      receive_coins_from_the_social_commerce_pool_convert_yazzer: { type: Boolean, "default": false },
      receive_100p_points_monthly_shares_block_evolution_shares: { type: Boolean, "default": false },
      created_at: { type: Date, "default": Date.now },
      updated_at: { type: Date },
      is_deleted: { type: Boolean, "default": false }, 
      deleted_date: { type: Date }
    });

    this.Payments = connection.model('Payments', paymentSchema);
    this.Products = connection.model('Products', productsSchema);
  }

  /**
   * 
   * @param {String} userId
   * @param {callback} cb 
   */
  findCurrentMonthPurchase(userId, cb) {
    let date = new Date();
    this.Payments.aggregate([
      { '$match': {'userid': userId, 'status': 'COMPLETED' } },
      { '$project': { year: { $year: "$created_at" }, month: { $month: "$created_at" }, 'amount': '$amount' } },
      { '$match': { 'year': date.getFullYear(), 'month': (date.getMonth() + 1) } },
      { '$group': {'_id': null, 'total': { '$sum': '$amount' }} }
    ], (e, p) => {
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
  getTransactionsCount(query, cb) {
    return this.Payments.count(query, cb);
  }

  /**
   * 
   * @param {Object} filter
   * @param {Number} currentPage
   * @param {Number} perPage 
   * @param {callback} cb 
   */
  getTransactions(filter, currentPage, perPage, cb) {
    let offset = (perPage * (currentPage - 1));
    let query  = {};
    let that   = this;

    if(filter.status) {
      switch(filter.status.toLowerCase()) {
        case 'verify': 
          query.status = 'VERIFIED';
          break;
        case 'pending':
          query['$or'] = [
            {status : 'PENDING'},
            {status : 'PROCESSING'}
          ];
          break;
        case 'completed':
          query.status = 'COMPLETED';
          break; 
      }
    }

    if(filter.minTime && filter.maxTime) {
      query["$and"] = [{"created_at": {"$gte": filter.minTime}}, {"created_at": {"$lt": filter.maxTime}}];
    }

    let payments = that.Payments.find(query).sort({"created_at": -1}).limit(perPage);
    if(offset !== 0) {
      payments = payments.skip(offset);
    }

    payments.exec(function(e, b) {
      if(!e) {
        return that.getTransactionsCount(query, (er, count) => {
          return cb(false, {"payments": b, count: (!er && count ? count : 0)});
        });
      }
      else {
        return cb(true, 'No transfers found');
      }
    })
  }

  /**
   * 
   * @param {Object} query 
   * @param {callback} cb 
   */
  newPaymentsCount(cb) {
    return this.Payments.count({'$or': [{'color_status': 'N'}, {'color_status': null}], '$or': [{'status':'PENDING'}, {'status': 'PROCESSING'}]}, cb);
  }

  /**
   * 
   * @param {Object} newValue
   * @param {callback} cb 
   */
  update(newValue, cb) {
    let orderId = newValue.order;
    let updateValues = {
      status: "COMPLETED",
      notes: newValue.notes,
      approved_date: (new Date()).toISOString(),
      gateway_status: "COMPLETED",
      color_status: "C"
    };
    return this.Payments.update({"order_id": orderId}, updateValues, cb);
  }

  /**
   * 
   * @param {Object} newValue
   * @param {Object} coinbase
   * @param {String} addressId
   * @param {callback} cb 
   */
  save(newValue, coinbase, addressId, cb) {
    let that = this;
    coinbase.createAddress(newValue.amount, addressId, function(e, info) {
      if(!e) {
        newValue.address       = info.address;
        newValue.invoice       = info.invoice;
        newValue.order_id      = (new Date()).getTime();
        newValue.payment_types = 1;

        let payment = new that.Payments(newValue);
        return payment.save(cb);
      }
      else {
        return cb(true, e);
      }
    });
  }

  /**
   * 
   * @param {Object} newValue
   * @param {Object} client
   * @param {Object} Ledger
   * @param {callback} cb 
   */
  saveCoinPayments(newValue, client, Ledger, cb) {
    let that = this;
    client.createTransaction({'currency1' : 'USD', 'currency2' : 'BTC', 'amount' : newValue.amount}, (e, info) => {
      if(!e) {
        newValue.address        = info.address;
        newValue.invoice        = info.invoice;
        newValue.transaction_id = info.txn_id;
        newValue.btc_amount     = (info.amount * 1);
        newValue.status_url     = info.status_url;
        newValue.qrcode_url     = info.qrcode_url;
        newValue.payment_types  = 1;
        newValue.order_id       = (new Date()).getTime();
        newValue.color_status   = 'N';

        let payment = new that.Payments(newValue);
        return payment.save((e, p) => {
          let date = (new Date()).toISOString()
          let newValue1 = {
            "userid": p.userid,
            "amount": p.amount,
            "fee": p.amount_fee,
            "total_amount": (p.fee_amount + p.amount),
            "status": newValue.status,
            "object_id": p._id,
            "object_type": "PRODUCT",
            "account_id": newValue.order_id,
            "description": "Product Purchase: " + newValue.product_name,
            "created_at": date,
            "sign": "+",
            "sign_amount": (p.fee_amount + p.amount),
            "actual_id": newValue.actual_id
          };

          Ledger.save(newValue1, (el, l) => {
            return cb(false, p);
          });
        });
      }
      else {
        return cb(true, e);
      }
    });
  }

  /**
   * 
   * @param {Object} newValue
   * @param {Object} client
   * @param {Object} Ledger
   * @param {callback} cb 
   */
  saveExpayPayments(newValue, client, Ledger, cb) {
    let that = this;
    newValue.payment_types = 2;
    newValue.order_id      = (new Date()).getTime();
    newValue.color_status  = 'N';

    let payment = new that.Payments(newValue);
    return payment.save((e, p) => {
      let date = (new Date()).toISOString()
      let newValue1 = {
        "userid": p.userid,
        "amount": p.amount,
        "fee": p.amount_fee,
        "total_amount": (p.fee_amount + p.amount),
        "status": newValue.status,
        "object_id": p._id,
        "object_type": "PRODUCT",
        "account_id": newValue.order_id,
        "description": "Product Purchase: " + newValue.product_name,
        "created_at": date,
        "sign": "+",
        "sign_amount": (p.fee_amount + p.amount),
        "actual_id": newValue.actual_id
      };

      Ledger.save(newValue1, (el, l) => {
        return cb(false, p);
      });
    });
  }

  /**
   * 
   * @param {Object} newValue
   * @param {Object} client
   * @param {Object} Ledger
   * @param {callback} cb 
   */
  savePayZaPayments(newValue, Ledger, cb) {
    let that = this;
    newValue.payment_types = 2;
    newValue.order_id      = (new Date()).getTime();
    newValue.color_status  = 'N';

    let payment = new that.Payments(newValue);
    return payment.save((e, p) => {
      let date = (new Date()).toISOString()
      let newValue1 = {
        "userid": p.userid,
        "amount": p.amount,
        "fee": p.amount_fee,
        "total_amount": (p.fee_amount + p.amount),
        "status": newValue.status,
        "object_id": p._id,
        "object_type": "PRODUCT",
        "account_id": newValue.order_id,
        "description": "Product Purchase: " + newValue.product_name,
        "created_at": date,
        "sign": "+",
        "sign_amount": (p.fee_amount + p.amount),
        "actual_id": newValue.actual_id
      };

      Ledger.save(newValue1, (el, l) => {
        return cb(false, p);
      });
    });
  }

  updatePayments(orderId, status, Notifications, Ledger, Users, cb) {
    let payment = this.Payments;
    let date = (new Date()).toISOString();
    let colorStatus = 'F';

    if (status === 'COMPLETED') {
      colorStatus = 'C';
    }

    return payment.findOne({"order_id": orderId}, (eo, o) => {
      if(!eo && o) {
        return payment.update({"_id": o._id}, {"status": status, "gateway_status": status, "updated_at": date, "color_status": colorStatus}, (e, p) => {
          return Ledger.update({"object_id": o._id}, {"status": status}, (el, l) => {
            return Notifications.saveNotification(o.userid, "Payment is " + status, (c, b) => {
              return cb((e || el), "");
            });
          });
        });
      }
      else {
        return cb(true, "Payment not found.");
      }
    });
  }

  getPaymentsByOderId(orderId, cb) {
    let payment = this.Payments;

    return payment.findOne({"order_id": orderId}, (eo, o) => {
      if(!eo && o) {
        return cb(false, o);
      }
      else {
        return cb(true, "Payment not found.");
      }
    });
  }

  /**
   * 
   * @param {Object} newValue
   * @param {String} userId
   * @param {callback} cb 
   */
  createProduct(newValue, userId, cb) {
    newValue.user_id = userId;

    let product = new this.Products(newValue);
    return product.save(cb);
  }
  /**
   * 
   * @param {Object} query
   * @param {callback} cb 
   */
  getProductsCount(query, cb) {
    return this.Products.count(query, cb);
  }

  /**
   * 
   * @param {Number} currentPage
   * @param {Number} perPage
   * @param {callback} cb 
   */
  listProduct(currentPage, perPage, cb) {
    let offset = (perPage * (currentPage - 1));
    let query  = {"is_deleted": false};
    let that   = this;

    let product = that.Products.find(query, '-__v -user_id').sort({"created_at": -1}).limit(perPage);
    if(offset !== 0) {
      product = product.skip(offset);
    }

    product.exec(function(e, b) {
      if(!e) {
        return that.getProductsCount(query, (er, count) => {
          return cb(false, {"products": b, count: (!er && count ? count : 0)});
        });
      }
      else {
        return cb(true, 'No products found');
      }
    })
  }

  /**
   * 
   * @param {callback} cb 
   */
  listProductPurchase(cb) {
    let product = this.Products.find({}, '_id name value currency_code created_at product_type amount shares after_three_month after_three_month_string receive_20p_points_monthly_shares_block_evolution_shares can_trade receive_affiliate_commissions receive_coins_from_index_buying receive_coins_from_the_social_commerce_pool receive_50p_points_in_monthly_shares_block_evolution_shares includes_yazzer_membership_including_jet_and_yacht_points receive_coins_from_index_buying_convert_yazzer receive_coins_from_the_social_commerce_pool_convert_yazzer receive_100p_points_monthly_shares_block_evolution_shares');
    return product.exec(cb);
  }

  /**
   * 
   * @param {String} productId
   * @param {callback} cb 
   */
  getProductById(productId, cb) {
    let that   = this;

    this.Products.findOne({"_id": productId}, function(e, b) {
      if(!e) {
        return cb(false, b);
      }
      else {
        return cb(true, 'No products found');
      }
    });
  }

  totalPurchase(userId, cb) {
    return this.Payments.count({status: 'COMPLETED', "userid": userId}, cb)
  }

  sumOfPurchase(productIds, userId, cb) {
    return this.Payments.aggregate([
      { "$match": { "product_id": {"$in": productIds}, "status": "COMPLETED", "userid": userId } },
      { "$group": { _id: "$product_id", "total": { "$sum": "$amount" } } }
    ], cb);
  }

  listProductTask(dateTime, cb) {
    return this.Payments.find({"status": "PROCESSING", "payment_type": "BTC", "payment_types": 1, "status_url": {"$ne": null}, "transaction_id": {"$ne": null}, "created_at": {"$lte": dateTime}}, cb);
  }

  /**
   * 
   * @param {Object} newValue
   * @param {Object} client
   * @param {Object} Ledger
   * @param {callback} cb 
   */
  saveCoinPaymentsCancelled(paymentId, statusText, Ledger, cb) {
    let payment = this.Payments;
    let date = (new Date()).toISOString();

    return payment.update({"_id": paymentId}, {"status": "CANCELLED", "gateway_status": statusText, "updated_at": date}, (e, p) => {
      return Ledger.update({"object_id": paymentId}, {"status": "CANCELLED"}, (el, l) => {
        return cb((e || el), "");
      });
    });
  }

  /**
   * 
   * @param {Object} newValue
   * @param {Object} client
   * @param {Object} Ledger
   * @param {callback} cb 
   */
  saveCoinPaymentsCompleted(paymentId, statusText, Ledger, cb) {
    let payment = this.Payments;
    let date = (new Date()).toISOString();

    return payment.update({"_id": paymentId}, {"status": "COMPLETED", "gateway_status": statusText, "updated_at": date}, (e, p) => {
      return Ledger.update({"object_id": paymentId}, {"status": "COMPLETED"}, (el, l) => {
        return cb((e || el), "");
      });
    });
  }

  getProductByOderId(orderId, cb) {
    let payment = this.Payments;
    let product = this.Products;

    return payment.findOne({"order_id": orderId}, (eo, o) => {
      if(!eo && o) {
        product.findOne({"_id": o.product_id}, (ep, p) => {
          if(!ep && p) {
            return cb(false, {
              "product_belongs": p.product_belongs,
              "userid": o.userid,
              "amount": o.amount
            });
          }
          else {
            return cb(true, "Product not found.")
          }
        })
      }
      else {
        return cb(true, "Payment not found.");
      }
    });
  }

  deleteProduct(productId, cb) {
    let product = this.Products;
    return product.update({"_id": productId}, {"is_deleted": true, "deleted_date": (new Date()).toISOString()}, cb);
  }
}

module.exports = Payment;
module.exports.getName = () => {
  return 'payment';
}
