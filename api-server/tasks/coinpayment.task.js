'use strict';

const TaskServer        = require('../tasks.server');
const Payments          = require('../server/api/purchase/model/payment.model');
const CoinPaymentConfig = require('../server/api/purchase/model/purchase.json');
const Ledger            = require('../server/api/wallet/model/ledger.model');
const Moment            = require('moment');
const CoinPayments      = require('coinpayments');

class CoinPaymentsTask {

  constructor(server) {
    this.Payments     = new Payments(server['plugins']['hapi-mongoose']);
    this.Ledger       = new Ledger(server['plugins']['hapi-mongoose']);
    this.CoinPayments = new CoinPayments(CoinPaymentConfig.coinPayments);
  }

  getList(cb) {
    let dateTime = Moment().subtract(4, 'hours').toISOString();
    return this.Payments.listProductTask(dateTime, cb);
  }

  checkAndUpdateStatus(listObj, index, length, cb) {
    let that = this;

    if(index < length && listObj[index]) {
      this.CoinPayments.getTx(listObj[index].transaction_id, (e, t) => {
        if(t.status === -1) {
          return this.Payments.saveCoinPaymentsCancelled(listObj[index]._id, t.status_text, this.Ledger, (ep, p) => {
            console.log('Payment Cancelled', ep, p);
            return this.checkAndUpdateStatus(listObj, index + 1, length, cb);
          });
        } 
        else if(t.status === 100) {
          return this.Payments.saveCoinPaymentsCompleted(listObj[index]._id, t.status_text, this.Ledger, (ep, p) => {
            console.log('Payment Completed', ep, p);
            return this.checkAndUpdateStatus(listObj, index + 1, length, cb);
          });
        } 
        else {
          return this.checkAndUpdateStatus(listObj, index + 1, length, cb);
        }
      });
    }
    else {
      return cb(false, 'Process completed.');
    }
  }

  execute() {
    let that = this;
    
    that.getList((err, ul) => {
      if(err || ul.length === 0) {
        console.log(err, 'No data found.');
        process.exit(0);
      }
      else {
        that.checkAndUpdateStatus(ul, 0, ul.length, (e, c) => {
          console.log(e, c);
          process.exit(0);
        });
      }
    });
  }
}

let taskServer = new TaskServer(8111);
taskServer.getServer((server) => {
  let coinPaymentsTask = new CoinPaymentsTask(server);
  coinPaymentsTask.execute();
});