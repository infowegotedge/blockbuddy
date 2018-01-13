'use strict';

class Orders {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // Order Schmea Definition
    let ordersSchema = new Schema({
      userid: { type: Object },
      name: { type: String },
      qunitity: { type: Number },
      price: { type: Number },
      amount: { type: Number },
      purchase_power: { type: Number },
      status: { type: String },
      created_at: { type: Date, "default": Date.now },
      updated_at: { type: Date }
    });

    let totalIncomeSchema = new Schema({
      userid: { type: Object },
      amount_usd: { type: Number },
      amount_btc: { type: Number },
      created_at: { type: Date }
    });

    this.Orders = connection.model('orders', ordersSchema);
    this.TotalIncome = connection.model('incomes', totalIncomeSchema);
  }

  saveOrder(newValue, cb) {
    let orders = new this.Orders(newValue);
    return orders.save(cb);
  }

  saveIncome(newValue, cb) {
    // let createdAt       = (new Date()).toISOString();
    // newValue.created_at = createdAt;
    // newValue.updated_at = createdAt;
    let totalIncome = new this.TotalIncome(newValue);
    return totalIncome.save(cb);
  }

  findIncome(findValue, cb) {
    this.TotalIncome.find({'userid': findValue}, function(e, c) {
      if(!e && (!c || !c[0])) {
        return cb(false, c)
      }
      return cb(true, e);
    });
  }

  sumIncome(userId, cb) {
    return this.TotalIncome.aggregate([{
        "$match": {"userid": userId}
      }, {
        "$group": {
          "_id": "$userid",
          "totalUSD": {"$sum": "$amount_usd"},
          "totalBTC": {"$sum": "$amount_btc"}
        }
      }
    ], cb);
  }

  sumPurchasedPower(userId, cb) {
    return this.Orders.aggregate([{
        "$match": {"userid": userId}
      }, {
        "$group": {
          "_id": "$userid",
          "totalPower": {"$sum": "$purchase_power"}
        }
      }
    ], cb);
  }
}

module.exports = Orders;
module.exports.getName = () => {
  return 'orders';
}
