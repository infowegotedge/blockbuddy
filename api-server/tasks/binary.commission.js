'use strict';

const Purchase     = require('../server/api/purchase/model/purchase.model');
const BinaryAmount = require('../server/api/binarycommission/model/binarycommission.model');
const TaskServer   = require('../tasks.server');
const Binary       = require('../server/component/neo4j_db');
// const Config       = require('../server/api/purchase/model/purchase.json');
const Rates        = require('../server/api/admin/model/rates.model');
const Settings     = require('../server/api/admin/model/settings.model');

class BinaryCommission {

  constructor(server) {
    this.purchase     = new Purchase(server['plugins']['hapi-mongoose']);
    this.binaryAmount = new BinaryAmount(server['plugins']['hapi-mongoose']);
    // this.rates        = new Rates(server['plugins']['hapi-mongoose']);
    this.settings     = new Settings(server['plugins']['hapi-mongoose']);
    this.cutofValue   = 0;
  }

  getBinaryCommissionData(hpos, skip, limit, cb) {
    return Binary.findHposMembers(hpos, skip, limit, (e, bp) => {
      if(e) {
        return cb(true, 'Binary commission are not found.');
      }
      return cb(false, bp);
    });
  }

  doBinary(hpos, object, start, len, pos, cb) {
    let that = this;
    if(len > 0 && start < len) {
      let row = object.records[start].get('hs')['properties'];

      return Binary.leftrightMember('', row.id, (e, bp) => {
        let row0 = {"id": 0, "pv": 0}, row1 = {"id": 0, "pv": 0};

        if(bp.records.length == 2) {
          let record0 = bp.records[0].get('n');
          let record1 = bp.records[1].get('n');

          if(record0['properties'].position === 'L') {
            row0 = record0['properties'];
          }
          else if (record0['properties'].position === 'R') {
            row1 = record0['properties'];
          }

          if(record1['properties'].position === 'L') {
            row0 = record1['properties'];
          }
          else if (record1['properties'].position === 'R') {
            row1 = record1['properties'];
          }
        }
        else if(bp.records.length == 1) {
          let record0 = bp.records[0].get('n');

          if(record0['properties'].position === 'L') {
            row0 = record0['properties'];
          }
          else if (record0['properties'].position === 'R') {
            row1 = record0['properties'];
          }
        }

        return Binary.sumOfPV(row0.id, (e, sp) => {
          return Binary.sumOfPV(row1.id, (e1, sp1) => {
            // let spz0 = sp.records[0].get('sumofpv');
            let spc0 = sp.records[0].get('count');
            // let spz1 = sp1.records[0].get('sumofpv');
            let spc1 = sp1.records[0].get('count');

            let purchase = {
              "userid": row.id,
              "doj": row.joinat,
              "sponsor": row.sponsor_id,
              // "left_pv_count": 0, // spz0 + row0.pv,
              // "right_pv_count": 0, // spz1 + row1.pv,
              "left_count": spc0.low + (row0.id ? 1 : 0),
              "right_count": spc1.low + (row1.id ? 1 : 0),
              "hpos": (hpos + 1)
            }
            
            return that.purchase.saveAllPurchase(purchase, (e, c) => {
              return that.doBinary(hpos, object, (start+1), len, pos, cb);
            });
          });
        });
      });
    }
    else {
      return cb(true, '');
    }
  }

  doBinaryTask(hpos, cb) {

    let that = this;

    return that.getBinaryCommissionData(hpos, 0, 0, (e, bp) => {
      if(e) {
        console.log(bp);
        return process.exit(0)
      }
      
      return that.doBinary(hpos, bp, 0, bp.records.length, 1, (e, u) => {
        if(hpos === 0) {
          return cb(true, 'Process done.');
        }
        else {
          console.log("For: " + hpos + " process done. Next process " + (hpos-1), "\n\n");
          return that.doBinaryTask((hpos-1), cb)
        }
      });
    });
  }

  doCommissionAmount(Config, object, len, start, list, cb) {
    let that = this;
    if(len > 0 && start < len) {
      let row        = object[start];
      let rowLeftPV  = row.left_pv_count
      let rowRightPV = row.right_pv_count

      if(rowLeftPV === 0 || rowRightPV === 0) {
        return that.doCommissionAmount(Config, object, len, (start+1), list, cb);
      }
      else {
        let pv               = 0;
        let binaryCommission = {
          'userid': row.userid,
          'commission': 0,
          'created_at': new Date(),
          'description': 'Binary Commission',
          'status': 'COMPLETED'
        }
        if(rowLeftPV > rowRightPV) {
          pv = parseInt(rowRightPV);
          if (pv >= parseInt(this.cutofValue)) {
            pv = parseInt(this.cutofValue);
          }
          else if(pv >= parseInt(Config.machine.pv)) {
            pv = parseInt(Config.machine.pv);
          }
          else if(pv >= parseInt(Config.pool.pv)) {
            pv = parseInt(Config.pool.pv);
          }
          rowLeftPV  = rowLeftPV - pv;
          rowRightPV = 0;
        }
        else if(rowLeftPV < rowRightPV) {
          pv = parseInt(rowLeftPV);
          if (pv >= parseInt(this.cutofValue)) {
            pv = parseInt(this.cutofValue);
          }
          else if(pv >= parseInt(Config.machine.pv)) {
            pv = parseInt(Config.machine.pv);
          }
          else if(pv >= parseInt(Config.pool.pv)) {
            pv = parseInt(Config.pool.pv);
          }
          rowRightPV = rowRightPV - pv;
          rowLeftPV  = 0;
        }

        binaryCommission['commission'] = (pv * 10);
        list.push(binaryCommission);
        return that.doCommissionAmount(Config, object, len, (start+1), list, cb);
      }
    }
    else {
      return cb(false, list);
    }
  }

  doCommission() {
    let that = this;
    return that.purchase.findAllPurchases((e, c) => {
      if(e) {
        console.log(e);
        process.exit(0);
      }

      // return this.rates.getRates((e1, r1) => {
      //   if(e1 || !r1) {
      //     console.log(e1, r1);
      //     process.exit(0);
      //   }

        return that.doCommissionAmount(r1, c, c.length, 0, [], (e, n) => {
          console.log(n);
          return process.exit(0);
          // return that.doTask(n, 0, n.length, []);
        });
      // });
    });
  }

  doTask(obj, start, len, list) {
    let that = this;
    if(len > 0 && start < len) {
      let row = obj[start];
      that.binaryAmount.create(row, (e, n) => {
        console.log(e, n);
        return that.doTask(obj, (start+1), len);
      });
    }
    else {
      console.log(list);
      return process.exit(0);
    }
  }

  execute() {
    let that = this;
    let hpos = null;

    return this.settings.getSettings((e, s) => {
      if(e || !s) {
        console.log(e, 'Cut of price not found');
        process.exit(0);
      }

      // Set CutOfValue
      this.cutofValue = s.cut_off_value;

      this.binaryAmount.findTaskCommission((e, c) => {
        if(e || (c && c.length === 0)) {
          console.log(e, 'Commission Amount Not Define.');
          process.exit(0);
        }

        this.Commissions = c;

        return Binary.findHpos((e, c) => {
          if(e || c.length === 0) {
            console.log(e, 'No Data Found.');
            return process.exit(0);
          }
  
          hpos = c.records[0].get('hpos').low - 1;
          return that.doBinaryTask(hpos, (e, cb) => {
            console.log(e, cb);
            return that.doCommission();
          });
        });
      });
    });
  }
}

let taskServer = new TaskServer(8000);
taskServer.getServer((server) => {
  let binaryCommission = new BinaryCommission(server);
  binaryCommission.execute();
});
