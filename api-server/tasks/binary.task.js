'use strict';

const User = require('../server/api/auth/model/users.model');
const Tasks = require('../server/api/tasks/model/tasks.model');
const TaskServer = require('../tasks.server');
const Binary = require('../server/component/neo4j_db');

class BinaryTask {

  constructor(server) {
    this.users = new User(server['plugins']['hapi-mongoose']);
    this.tasks = new Tasks(server['plugins']['hapi-mongoose']);
  }

  getBinary(t) {
    let sponsor = this.users.getSponsor();
    if (t === null || (typeof t === 'undefined' && typeof t._id === 'undefined')) {
      return sponsor.find({}).sort({ "_id": 1 });
    } else {
      return sponsor.find({ "_id": { "$gt": t.taskid } }).sort({ "_id": 1 });
    }
  }

  _doBinary(bu, len, start, cb) {
    var that = this;
    if (bu[start] !== 'undefined' && start < len) {
      Binary.create(bu[start], (_e, _u) => {
        if (_e && _u == 'No result found') {
          Binary.createOne(bu[start], (e, u) => {
            return that._doBinary(bu, len, (start + 1), cb)
          })
        } else {
          let properties = _u.get('hs')['properties'], //_u['hs']['properties'],
              buStart = bu[start];
          if (typeof properties['actual_sponsor_id'] !== 'undefined' && properties['sponsor_id'] !== buStart['sponsorid']) {
            let sponsor = that.users.getSponsor();
            sponsor.update({ "sponsorid": buStart['sponsorid'], "name": buStart['name'], "email": buStart['email'] }, {
              "actualsponsorid": properties['actual_sponsor_id'],
              "sponsorid": properties['sponsor_id']
            }, (e, u) => {
              return that._doBinary(bu, len, (start + 1), cb);
            });
          } else {
            return that._doBinary(bu, len, (start + 1), cb);
          }
        }
      });
    } else {
      var item = bu[(len - 1)];
      return cb(false, item);
    }
  }

  execute() {
    let that = this;
    that.tasks.getTask('binary', (e, t) => {
      if (!e) {
        that.getBinary(t).exec((e, u) => {
          that._doBinary(u, u.length, 0, (e, b) => {
            if (t === null || (typeof t === 'undefined' && typeof t._id === 'undefined')) {
              that.tasks.create('binary', b._id, (e, t) => {
                console.log(e, b, t);
                return process.exit(0);
              });
            } else if(b && b._id) {
              that.tasks.update('binary', b._id, (e, t) => {
                console.log(e, b, t);
                return process.exit(0);
              });
            }
            else {
              console.log('No Binary Task Found.');
              return process.exit(0);
            }
          });
        });
      } else {
        console.log(e, t);
        return process.exit(0);
      }
    });
  }
}

let taskServer = new TaskServer(8001);
taskServer.getServer((server) => {
  let binaryTask = new BinaryTask(server);
  binaryTask.execute();
});