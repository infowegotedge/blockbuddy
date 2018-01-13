'use strict';

const User = require('../server/api/auth/model/users.model');
const OrphanUser = require('../server/api/auth/model/orphan-users.model');
const TaskServer = require('../tasks.server');

class OrphanUsersTask {

  constructor(server) {
    this.Users = new User(server['plugins']['hapi-mongoose']);
    this.OrphanUsers = new OrphanUser(server['plugins']['hapi-mongoose']);
  }

  updateOrphanUser(obj, start, length) {
    let that = this;

    if (obj[start] !== 'undefined' && start < length) {

      let referral = obj[start];

      this.OrphanUsers.getModel().update({"username": referral.username, "email": referral.email}, {"is_found": true}, (e, f) => {
        console.log('>>>> ', e, f);
        return that.updateOrphanUser(obj, (start + 1), length);
      });

    } else {
      console.log('Process Done');
      return process.exit(0);
    }
  }

  execute() {
    let that = this;

    this.Users.getUserModel().find({}, 'username email').sort({'_id': 1}).exec((e, u) => {
      if(!e || u) {

        return that.updateOrphanUser(u, 0, u.length);

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