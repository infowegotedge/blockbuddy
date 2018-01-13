'use strict';

const User = require('../server/api/auth/model/users.model');
const OrphanUser = require('../server/api/auth/model/orphan-users.model');
const TaskServer = require('../tasks.server');

class OrphanUsersTask {

  constructor(server) {
    this.Users = new User(server['plugins']['hapi-mongoose']);
    this.OrphanUsers = new OrphanUser(server['plugins']['hapi-mongoose']);
  }

  updateOrphanUser(obj, start, length, userId) {
    let that = this;

    if (obj[start] !== 'undefined' && start < length) {

      let referral = obj[start];

      if(start == 0) {
        this.Users.getSponsor().update({"_id": referral._id}, {"position": "L"}, (e, f) => {
          console.log('>>>>>>> ', (start+1), e, f);
          return that.updateOrphanUser(obj, (start + 1), length, referral['userid']);
        });
      }
      else {
        this.Users.getUserModel().findOne({"_id": userId}, (_e, _u) => {
          if(!_e && _u) {
            that.Users.getSponsor().update({"_id": referral._id}, {"sponsorid": _u._id, "sponsor": _u.username, "position": "L"}, (e, f) => {
              console.log('>>>> ', (start+1), e, f, referral['userid']);
              return that.updateOrphanUser(obj, (start + 1), length, referral['userid']);
            });
          }
          else {

          }
        });
      }

    } else {
      console.log('Process Done');
      return process.exit(0);
    }
  }

  execute() {
    let that = this;

    this.Users.getSponsor().find({$and: [{userid: {"$gte": "59cf5a4ad501d64085314da0"}}, {"userid": {"$lte": "59cf7b0603790140a1552af9"}}]}, 'sponsorid sponsor position userid').sort({'_id': 1}).exec((e, u) => {
    // this.Users.getSponsor().find({userid: {"$gte": "59d312d340ce025ed038e3c8"}}, 'sponsorid sponsor position userid').sort({'_id': 1}).exec((e, u) => {
      if(!e || u) {

        return that.updateOrphanUser(u, 0, u.length, null);
        // return that.updateOrphanUser(u, 0, u.length, "59cf7b0603790140a1552af9");

      } else {
        process.exit(0);
      }
    });
  }
}

let taskServer = new TaskServer(8881);
taskServer.getServer((server) => {
  let binaryTask = new OrphanUsersTask(server);
  binaryTask.execute();
});