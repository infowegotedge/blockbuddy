'use strict';

const RePurchase       = require('../server/api/purchase/model/repurchase.model');
const PurchaseJson     = require('../server/api/purchase/model/purchase.json');
const BinaryCommission = require('../server/api/binarycommission/model/binarycommission.model');
const TaskServer       = require('../tasks.server');

class DBRepurchaseBinary {

  constructor(server) {
    this.repurchase       = new RePurchase(server['plugins']['hapi-mongoose']);
    this.binaryCommission = new BinaryCommission(server['plugins']['hapi-mongoose']);
    this.repurcahse       = PurchaseJson.repurchase.commission;
  }

  getBinaryCommissionData(status, cb) {
    return this.repurchase.findRepuchase(status, function(e, bp) {
      if(e) {
        return cb(true, 'Binary commission are not found.');
      }
      return cb(false, bp);
    });
  }

  doCommission(leftRPV, rightRPV) {
    let countRPV = rightRPV;
    if(leftRPV < rightRPV) {
      countRPV = leftRPV;
    }

    return (parseInt(countRPV / 3) * 3);
  }

  doTask(start, len, object, cb) {
    let that = this;
    if(len > 0 && start < len) {
      let row = object[start];

      if(row['left_rpv_count'] >= 3 && row['right_rpv_count'] >= 3 && row['own_rpv'] > 0)
      {
        let balanceRPV       = that.doCommission(row['left_rpv_count'], row['right_rpv_count']);
        let binaryCommission = {
          userid: row['userid'],
          commission: (balanceRPV * 10),
          created_at: (new Date()).toISOString(),
          description: 'Repurchase commission',
          status: 'COMPLETED',
          repurchase: true
        };

        return this.binaryCommission.create(binaryCommission, function(e, c) {
          if(!e) {
            return that.repurchase.updateValue({status: 2}, row['userid'], function(eu, cu) {
              return that.doTask((start+1), len, object, cb);
            })
          }
          else {
            console.log(c);
            return that.doTask((start+1), len, object, cb);
          }
        });
      }
      else {
        return that.repurchase.updateValue({status: 2}, row['userid'], function(eu, cu) {
          return that.doTask((start+1), len, object, cb);
        });
      };
    }
    else {
      return cb(true, '');
    }
  }

  execute() {
    let that = this;
    let hpos = null;

    return that.getBinaryCommissionData(1, function(e, c) {
      if(e) {
        console.log(c);
        return process.exit(0);
      }
      else {
        return that.doTask(0, c.length, c, function(e, cb) {
          console.log(cb);
          return process.exit(0);
        });
      }
    });
  }
}

let taskServer = new TaskServer(8002);
taskServer.getServer((server) => {
  let repurchase = new DBRepurchaseBinary(server);
  repurchase.execute();
});