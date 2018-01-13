'use strict';

const TaskServer  = require('../tasks.server');
const Withdrawal  = require('../server/api/wallet/model/wallet.model');
const Ledger      = require('../server/api/wallet/model/ledger.model');
const CoinPayment = require('coinpayments');
const Config      = require('../server/api/purchase/model/purchase.json');

class WithdrawalTasks {

  constructor(server) {
    this.withdrawal = new Withdrawal(server['plugins']['hapi-mongoose']);
    this.ledger     = new Ledger(server['plugins']['hapi-mongoose']);
    this.client     = new CoinPayment(Config.coinPayments);
  }

  getWithdrawals(cb) {
    return this.withdrawal.getAutoWithdrawal(cb)
  }

  processAmounts(objects, index, length) {
    let that = this;
    if(index < length && objects[index]) {
      let obj = objects[index];
      return this.client.createWithdrawal({
        "address": obj.btc_address,
        "amount": obj.amount_withdrawal,
        "currency": "BTC",
        "currency2": "EUR",
        "note": (obj.user_name ? obj.user_name : ""),
      }, (e, sm) => {
        console.log(obj._id, e, sm);

        if(!e && sm) {
          let network = {
            "status": 'PROCESSING', 
            "transaction_hash": (sm.id ? sm.id : null),
            "transaction_fee": 0,
            "transaction_amount": sm.amount,
            "transaction_status": sm.status,
            "transaction_btc": obj.btc_address
          };
          return that.withdrawal.updateWithdrawal(obj._id, this.ledger, network, (e, r) => {
            return that.processAmounts(objects, (index+1), length)
          });
        }
        else {
          return that.processAmounts(objects, (index+1), length)
        }
      });
    }
    else {
      console.log('Process Done.');
      process.exit(0);
    }
  }

  execute() {
    let that = this;
    return that.getWithdrawals((e, w) => {
      if(!e) {
        return that.processAmounts(w, 0, w.length);
      }
      else {
        console.log('No withdrawals found.');
        process.exit(0);
      }
    })
  }
}

let withdrawalServer = new TaskServer(8010);
withdrawalServer.getServer((server) => {
  let withdrawalTask = new WithdrawalTasks(server);
  withdrawalTask.execute();
});