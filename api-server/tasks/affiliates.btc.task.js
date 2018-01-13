'use strict';

const TaskServer  = require('../tasks.server');
const Affiliate   = require('../server/api/affiliates/model/affiliates.model');
const Moment      = require('moment');
const CoinBase    = require('../server/component/coinbase_api');
const CoinbaseApi = require('../server/api/purchase/model/purchase.json');

class AffiliatesBTCTask {

  constructor(server) {
    this.Affiliates = new Affiliate(server['plugins']['hapi-mongoose']);
    this.Coinbase   = new CoinBase(CoinbaseApi.coinbase.key, CoinbaseApi.coinbase.secret);
    this.AccountId  = CoinbaseApi.coinbase.accountId;
  }

  getTasksVerifyList(cb) {
    console.log('Obtain Tasks List');
    return this.Affiliates.getTasksVerifyList(cb);
  }

  getCoinbaseTransactions(cb) {
    console.log('Obtain Coinbase Transaction List');
    return this.Coinbase.getTransactions(this.AccountId, cb)
  }

  verifyObtainList(obj, obtainList, cb) {
    let list1 = (obtainList['info1'] ? obtainList['info1'].length : 0);
    let list2 = (obtainList['info2'] ? obtainList['info2'].length : 0);
    
    for(let idx=0; idx<list1; idx++) {
      if(obtainList['info1'][idx].network && obj.verifyHash && obj.verifyHash === obtainList['info1'][idx].network.hash && obtainList['info1'][idx].status.toLowerCase() === 'completed') {
        return cb(false, 'Done');
      }
    }

    for(let idx=0; idx<list2; idx++) {
      if(obtainList['info2'][idx].network && obj.verifyHash && obj.verifyHash === obtainList['info2'][idx].network.hash && obtainList['info1'][idx].status.toLowerCase() === 'completed') {
        return cb(false, 'Done');
      }
    }

    return cb(true, 'Not Done');
  }

  doVerifyTask(dbList, obtainList, index, length) {
    let that = this;

    if(index < length && dbList[index]) {
      that.verifyObtainList(dbList[index], obtainList, (err, data) => {
        console.log(err, data);

        if(err === false) {
          let endDate   = Moment().add(1, 'years').toISOString();
          let startDate = Moment().toISOString();

          return that.Affiliates.updateVerifyHashTask(
            {"userid":dbList[index].userid, "invoice_no":dbList[index].invoice_no},
            {"status":"COMPLETED", "invoice_status":"COMPLETED", "active":"Y", "verified":true, "start_date":startDate, "end_date":endDate, "updated_at":(new Date()).toISOString()},
            (e, v) => {
              console.log(e, v);
              return that.doVerifyTask(dbList, obtainList, (index+1), length);
          });

        }
        else {
          return that.doVerifyTask(dbList, obtainList, (index+1), length);
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
        that.getCoinbaseTransactions((et, lt) => {
          console.log('Coinbase Transaction List obtain');
          if(!e && lt['info1']) {
            return that.doVerifyTask(l, lt, 0, l.length);
          }
          else {
            console.log(et, lt);
            process.exit(0);
          }
        });
      }
      else {
        console.log(e, l);
        process.exit(0);
      }
    })
  }
}

let taskServer = new TaskServer(8007);
taskServer.getServer((server) => {
  let affiliatesBTC = new AffiliatesBTCTask(server);
  affiliatesBTC.execute();
});