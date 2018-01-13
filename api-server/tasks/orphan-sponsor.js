'use strict';

// const User = require('../server/api/auth/model/users.model');
const OrphanUser = require('../server/api/auth/model/orphan-users.model');
const TaskServer = require('../tasks.server');

class OrphanSponsorTask {

  constructor(server) {
    // this.Users = new User(server['plugins']['hapi-mongoose']);
    this.OrphanUsers = new OrphanUser(server['plugins']['hapi-mongoose']);
  }

  updateOrphanUser(obj, start, length, sponsorName) {
    let that = this;

    if (obj[start] !== 'undefined' && start < length) {

      let referral = obj[start];

      if(start === 0) {
        return that.updateOrphanUser(obj, (start + 1), length, referral['username']);
      }
      else {

        let displayName = referral['displayName'].split(' ');
        let firstName = referral['first_name'];
        let lastName = referral['last_name'];
        let email = referral['email'];
        let username = referral['username'];

        if(firstName == '' && displayName && displayName[0]) {
          firstName = displayName[0];
        }

        if(lastName == '' && displayName && displayName[1]) {
          lastName = displayName[1];
        }
        else {
          lastName = 'BB';
        }

        if(email == '') {
          email = referral['username'] + '@bb.com';
        }

        firstName = firstName.replace(/_/g, '');
        firstName = firstName.replace(/(\d+)/, ''); 

        this.OrphanUsers.getModel().update({"_id": referral._id}, {
          "sponsor": sponsorName,
          "first_name": firstName,
          "last_name": lastName,
          "email": email
        }, (e, f) => {
          console.log('>>>> ', e, f);
          return that.updateOrphanUser(obj, (start + 1), length, referral['username']);
        });
      }

    } else {
      console.log('Process Done');
      return process.exit(0);
    }
  }

  execute() {
    let that = this;

    this.OrphanUsers.getModel().find({"is_found": false}).sort({'_id': 1}).exec((e, u) => {
      if(!e || u) {

        return that.updateOrphanUser(u, 0, u.length, null);

      } else {
        process.exit(0);
      }
    });
  }
}

let taskServer = new TaskServer(8881);
taskServer.getServer((server) => {
  let binaryTask = new OrphanSponsorTask(server);
  binaryTask.execute();
});