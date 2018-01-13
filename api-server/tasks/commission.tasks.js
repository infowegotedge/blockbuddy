'use strict';

const TaskServer = require('../tasks.server');
const Users      = require('../server/api/auth/model/users.model');
const Commission = require('../server/api/binarycommission/model/binarycommission.model');
const Ledger     = require('../server/api/wallet/model/ledger.model');

class CommissionTask {

  constructor(server) {
    this.Users      = new Users(server['plugins']['hapi-mongoose']);
    this.Ledger     = new Ledger(server['plugins']['hapi-mongoose']);
    this.Commission = new Commission(server['plugins']['hapi-mongoose']);
  }

  getList(cb) {
    return this.Users.tasksCommissionDistribution(cb);
  }

  getCommission(cb) {
    return this.Commission.findTaskCommission(cb);
  }

  doCommission(commissions, index, length, row, cb) {
    let that = this;
    if(length > 0 && index <= length) {
      let commission = commissions[index-1];
      let commissionFee = 0;

      if(commission.commission_type == 'FIXED') {
        commissionFee = commission.commission;
      } else if(commission.commission_type == 'PERCENTAGE') {
        commissionFee = ((row.amount * commission.commission) / 100);
      }

      console.log(">>>> Level Number: ", index, "Commission Fee: ", commissionFee);

      that.Users.isUserCanGetCommission(row.sponsorid, (_e, u) => {
        if(!_e && u) {
          that.Users.getUserForCommissionTask(row.sponsorid, (e, user) => {
            that.Users.getUserForCommissionTask(row.userid, (e1, user1) => {
              if(!e) {
                this.Ledger.save({
                  "userid": (user1.sponsorid + ''),
                  "amount": commissionFee,
                  "fee": 0,
                  "total_amount": commissionFee,
                  "status": 'COMPLETED',
                  "object_id": user1.sponsorid,
                  "object_name": (row.name || (user1.fname + ' ' + user1.lname)),
                  "object_type": 'USER',
                  "account_id": null,
                  "description": 'Binary Commission (From: ' + (row.username || user1.username) + ')',
                  "created_at": (new Date()).toISOString(),
                  "sign": '+'
                }, (el, l) => {
                  let row1 = {
                    "userid": (user._id + ''),
                    "sponsorid": (user.sponsorid + ''),
                    "username": (row.username || user1.username),
                    "name": (row.name || (user1.fname + ' ' + user1.lname)),
                    "amount": row.amount,
                    "_id": row._id
                  };
    
                  return that.doCommission(commissions, (index + 1), length, row1, cb);
                })
              }
              else {
                console.log(">>>> User Not Found.");
                return cb(false, 'Commission Distributed.')
              }
            });
          });
        }
        else {
          that.Users.getUserForCommissionTask(row.sponsorid, (e, user) => {
            that.Users.getUserForCommissionTask(row.userid, (e1, user1) => {
              if(!e && user) {
                let row1 = {
                  "userid": (user._id + ''),
                  "sponsorid": (user.sponsorid + ''),
                  "username": (row.username || user1.username),
                  "name": (row.name || (user1.fname + ' ' + user1.lname)),
                  "amount": row.amount,
                  "_id": row._id
                };
    
                console.log('>>>> Commission Not Distributed (No Purchase OR Refill Purchase Found) And Next To Go >>>> ')
                return that.doCommission(commissions, (index + 1), length, row1, cb);
              }
              else {
                console.log(">>>> User Not Found (No Purchase OR Refill Purchase Found).");
                return cb(false, 'Commission Distributed.')
              }
            });
          });
        }
      });
    }
    else {
      return cb(false, "Commission Distributed.");
    }
  }

  distributeCommission(commission, object, index, len, cb) {
    let that = this;
    if(len > 0 && index < len) {
      let row = object[index];

      return that.doCommission(commission, 1, commission.length, row, (e, u) => {
        return that.Users.updateUserCommission(row._id, (eu, us) => {
          console.log('>>>> ', e, eu, u, us);
          return that.distributeCommission(commission, object, (index + 1), len, cb);
        })
      });
    }
    else {
      return cb(false, "Process Completed.");
    }
  }

  execute() {
    let that = this;
    
    that.getCommission((ec, commission) => {
      if(ec || commission.length === 0) {
        console.log('Commission Not Found');
        return process.exit(0);
      }

      return that.getList((err, ul) => {
        if(err || ul.length === 0) {
          console.log(err, 'No data found.');
          return process.exit(0);
        }
        else {
          that.distributeCommission(commission, ul, 0, ul.length, (dce, dc) => {
            console.log(dce, dc);
            return process.exit(0);
          });
        }
      });
    });
  }
}

let taskServer = new TaskServer(8112);
taskServer.getServer((server) => {
  let commissionTask = new CommissionTask(server);
  commissionTask.execute();
});