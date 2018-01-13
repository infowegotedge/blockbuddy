'use strict';

const User = require('../server/api/auth/model/users.model');
const TaskServer = require('../tasks.server');

class ActualSponsorTask {

  constructor(server) {
    this.users = new User(server['plugins']['hapi-mongoose']);
  }

  updateUserSponsor(sponsor, obj, start, length) {
    let that = this;

    if (obj[start] !== 'undefined' && start < length) {

      let referral = obj[start];
      let position = referral.position;

      console.log(referral);

      this.users.getUser(referral.actualsponsorid, (e, u) => {

        console.log(referral.actualsponsorid, u);

        if(!e && u) {

          sponsor.update({"_id": referral._id}, {"sponsorid" : u._id, "sponsor": u.username}, (es, s1) => {

            console.log('>>>>>>>> '+ (start + 1) +' Sponsor and User Updated >>>>>>>>', es, s1);
            return that.updateUserSponsor(sponsor, obj, (start + 1), length)    

          });

        }
        else {
          console.log('>>>>>>>> '+ (start + 1) +' No User Found >>>>>>>>');
          return that.updateUserSponsor(sponsor, obj, (start + 1), length)
        }

      })


    } else {
      console.log('Process Done');
      return process.exit(0);
    }
  }

  execute() {
    let that = this;
    let referral = this.users.getSponsor();

    referral.find({}).sort({'_id': 1}).exec((e, u) => {
      if(!e || u) {

        return that.updateUserSponsor(referral, u, 0, u.length);

      } else {
        process.exit(0);
      }
    });
  }
}

let taskServer = new TaskServer(8881);
taskServer.getServer((server) => {
  let binaryTask = new ActualSponsorTask(server);
  binaryTask.execute();
});