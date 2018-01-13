'use strict';

const TaskServer  = require('../tasks.server');
const Withdrawal  = require('../server/api/wallet/model/wallet.model');
const Ledger      = require('../server/api/wallet/model/ledger.model');
const CoinPayment = require('coinpayments');
const Config      = require('../server/api/purchase/model/purchase.json');
const Moment      = require('moment');

class WithdrawalVerifyTasks {

  constructor(server) {
    this.withdrawal = new Withdrawal(server['plugins']['hapi-mongoose']);
    this.ledger     = new Ledger(server['plugins']['hapi-mongoose']);
    this.client     = new CoinPayment(Config.coinPayments);
  }

  getTasksVerifyList(cb) {
    console.log('Obtain Tasks List');
    return this.withdrawal.getAutoWithdrawalProcessingList(cb);
  }

  doVerifyTask(dbList, index, length) {
    let that = this;

    if(index < length && dbList[index]) {

      that.client.getWithdrawalInfo(dbList[index].transaction_hash, (err, data) => {
        console.log(err, data);

        if(!err && data.status == 2 && data.status_text == 'Complete') {
          return that.withdrawal.updateWithdrawal(dbList[index]._id, this.ledger,
            {"status":"COMPLETED", "transaction_status":"COMPLETED", "updated_at":Moment().toISOString()},
            (e, v) => {
              console.log(e, v);
              return that.doVerifyTask(dbList, (index+1), length);
          });    
        }
        else {
          return that.doVerifyTask(dbList, (index+1), length);
        }
      });
    }
    else {
      console.log('Process Done');
      process.exit(0);
    }
  }

  execute() {
    let that = this;

    return that.getTasksVerifyList((e, l) => {
      console.log('Task list obtain');
      if(!e && l.length > 0) {

        return that.doVerifyTask(l, 0, l.length);
      }
      else {
        console.log(e, l);
        process.exit(0);
      }
    })
  }
}

let taskServer = new TaskServer(8011);
taskServer.getServer((server) => {
  let withdrawalVerifyTasks = new WithdrawalVerifyTasks(server);
  withdrawalVerifyTasks.execute();
});