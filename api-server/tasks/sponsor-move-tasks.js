'use strict';

const User = require('../server/api/auth/model/users.model');
const TaskServer = require('../tasks.server');

class BinaryTaskPre {

  constructor(server) {
    this.users = new User(server['plugins']['hapi-mongoose']);
  }

  _doTask(bu, len, start) {
    let that = this;
    let sponsor = this.users.getSponsor();

    console.log('>>>>>>>>> ' + (start + 1));

    if (bu[start] !== 'undefined' && start < len) {

      let obj = bu[start];

      if(((start+1) % 2) === 0) {
        return sponsor.update({"_id": obj._id}, {"position": 'R'}, (e, c) => {
          if(e) {
            console.log(e);
          }

          console.log('???????', c);
          return that._doTask(bu, len, (start + 1));
        });
      }
      else {
        console.log('>>>>>>>>> else');
        return that._doTask(bu, len, (start + 1));
      }

    } else {
      console.log('Process Done');
      return process.exit(0);
    }
  }

  execute() {
    let that = this;
    let sponsor = this.users.getSponsor();
    
    sponsor.find({}, (e, u) => {
      if(!e && u && u.length > 0) {
        return that._doTask(u, u.length, 0);
      }
      else {
        console.log('No Data Found.');
        return process.exit(0);
      }
    });
  }
}

let taskServer = new TaskServer(8001);
taskServer.getServer((server) => {
  let binaryTask = new BinaryTaskPre(server);
  binaryTask.execute();
});