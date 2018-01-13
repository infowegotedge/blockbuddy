'use strict';

const User = require('../server/api/auth/model/users.model');
const TaskServer = require('../tasks.server');

class TaskPosition {

  constructor(server) {
    this.users = new User(server['plugins']['hapi-mongoose']);
  }

  updateUserSponsor(sponsor, obj, start, length) {
    let that = this;

    if (obj[start] !== 'undefined' && start < length) {

      let referral = obj[start];
      let position = 'R';

      if(((start + 1) % 2) == 0) {
        position = 'L'
      }

      sponsor.update({"_id": referral._id}, {"position": position}, (es, s1) => {

        console.log('>>>>>>>> '+ (start + 1) +' Sponsor Updated ' + position + ' >>>>>>>>', es, s1);
        return that.updateUserSponsor(sponsor, obj, (start + 1), length)    

      })

    } else {
      console.log('Process Done');
      return process.exit(0);
    }
  }

  execute() {
    let that = this;
    let referral = this.users.getSponsor();

    // referral.find({"$and": [{"_id": {"$gte": "59c25e414ba14fe0548a76c2"}}, {"_id": {"$lte": "59c270254ba14fe0548f952f"}}]}).sort({'_id': 1}).exec((e, u) => {
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
  let binaryTask = new TaskPosition(server);
  binaryTask.execute();
});