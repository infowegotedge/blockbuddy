'use strict';

const RePurchase     = require('../server/api/purchase/model/repurchase.model');
const BinaryAmount = require('../server/api/binarycommission/model/binarycommission.model');
const TaskServer   = require('../tasks.server');
const Binary       = require('../server/component/neo4j_db');

class RepurchaseBinary {

  constructor(server) {
    this.repurchase    = new RePurchase(server['plugins']['hapi-mongoose']);
    this.binnaryAmount = new BinaryAmount(server['plugins']['hapi-mongoose']);
    this.cutofValue    = 20;
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
      let row = object[start]['hs']['properties'];
      
      return Binary.leftrightMember('', row.id, (e, bp) => {
        let row0 = {"id": 0, "pv": 0}, row1 = {"id": 0, "pv": 0};

        if(bp.length == 2) {
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
        else if(bp.length == 1) {
          let record0 = bp.records[0].get('n');
          
          if(record0['properties'].position === 'L') {
            row0 = record0['properties'];
          }
          else if (record0['properties'].position === 'R') {
            row1 = record0['properties'];
          }
        }
        
        return Binary.sumOfRPV(row0.id, (e, sp) => {
          return Binary.sumOfRPV(row1.id, (e1, sp1) => {
            return Binary.ownRPV(row.id, (e2, sp2) => {
              let spz0 = sp.records[0].get('sumofpv');
              let spc0 = sp.records[0].get('count');
              let spz1 = sp1.records[0].get('sumofpv');
              let spc1 = sp1.records[0].get('count');
              let spz2 = sp2.records[0].get('hs.repurchase_pv');
              
              let purchase = {
                "userid": row.id,
                "doj": row.joinat,
                "sponsor": row.sponsor_id,

                "own_rpv": spz2,

                "left_rpv_count1": (row0.rpv ? row0.rpv : 0),
                "right_rpv_count1": (row1.rpv ? row1.rpv : 0),

                "left_rpv_count": ((sp.records.length > 0 && spz0) ? spz0 : 0),
                "right_rpv_count": ((sp1.records.length > 0 && spz1) ? spz1 : 0),

                "left_count": ((sp.records.length > 0 && spc0) ? spc0 : 0) + (row0.id ? 1 : 0),
                "right_count": ((sp1.records.length > 0 && spc1) ? spc1 : 0) + (row1.id ? 1 : 0),
                "repurchase": true,
                "status": 1
              }
              
              return that.repurchase.saveRePurchase(purchase, (e, c) => {
                return that.doBinary(hpos, object, (start+1), len, pos, cb);
              });

            });
          });
        });
      });
    }
    else {
      return cb(false, '');
    }
  }

  doBinaryTask(hpos, cb) {

    let that = this;

    return that.getBinaryCommissionData(hpos, 0, 1000, (e, bp) => {
      if(e) {
        console.log(bp);
        return process.exit(0)
      }

      return that.doBinary(hpos, bp, 0, bp.length, 1, (e, u) => {

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

  rpvUpdate(hpos, object, start, len, cb) {
    let that = this;
    if(len > 0 && start < len) {
      let row = object.records[start].get('hs')['properties'];
      return Binary.updateRPV(row.id, () => {
        return that.rpvUpdate(hpos, object, (start+1), len, cb);
      });
    }
    else {
      return cb(false, '');
    }
  }

  updateRPV(hpos, cb) {
    let that = this;
    if(hpos > 0) {
      return that.getBinaryCommissionData(hpos, 0, 1000, (e, bp) => {

        return that.rpvUpdate(hpos, bp, 0, bp.length, (e, u) => {
          if(hpos === 0) {
            return cb(true, 'Process done.');
          }
          else {
            console.log("For: " + hpos + " process done. Next process " + (hpos-1), "\n\n");
            return that.updateRPV((hpos-1), cb)
          }
        });
      });
    }
    else {
      return cb(false, '');
    }
  }
  
  execute() {
    let that = this;
    let hpos = null;

    return Binary.findHpos((e, c) => {
      hpos = c.records[0].get('hpos') - 1;

      return that.doBinaryTask(hpos, (e, cb) => {
        console.log(cb);
        return that.updateRPV(hpos, (eu ,cb) => {
          return process.exit(0);
        });
      });     
    });
  }
}

let taskServer = new TaskServer(8004);
taskServer.getServer((server) => {
  let repurchase = new RepurchaseBinary(server);
  repurchase.execute();
});
