'use strict';

const TaskServer = require('../tasks.server');
const Affiliate  = require('../server/api/affiliates/model/affiliates.model');
const Moment     = require('moment');

class AffiliatesHoldTask {

  constructor(server) {
    this.Affiliates = new Affiliate(server['plugins']['hapi-mongoose']);
  }

  getList(cb) {
    let dateTime = Moment().subtract(2, 'hours').toISOString();
    return this.Affiliates.getTasksList(dateTime, cb);
  }

  updateList(listObj, data, index, length, cb) {
    let that = this;

    if(index < length && listObj[index]) {
      return this.Affiliates.updateTask(listObj[index]._id, data, (e, l) => {
        console.log(e, l);
        return that.updateList(listObj, data, (index+1), length, cb)
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
        let dateTime = Moment().toISOString();
        let data     = {"$set": {"status": "HOLD", "invoice_status" : "HOLD", "active": "N", "updated_at": dateTime}};

        that.updateList(ul, data, 0, ul.length, (e, c) => {
          console.log(e, c);
          process.exit(0);
        });
      }
    });
  }
}

let taskServer = new TaskServer(8006);
taskServer.getServer((server) => {
  let affiliatesHold = new AffiliatesHoldTask(server);
  affiliatesHold.execute();
});