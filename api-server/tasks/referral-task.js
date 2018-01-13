'use strict';

const User = require('../server/api/auth/model/users.model');
const TaskServer = require('../tasks.server');

class TaskPre {

  constructor(server) {
    this.users = new User(server['plugins']['hapi-mongoose']);
  }

  updateUserSponsor(users, sponsor, obj, start, length) {
    let that = this;

    if (obj[start] !== 'undefined' && start < length) {

      let referral = obj[start];
      let position = referral.position;

      users.findOne({"username": referral.username}, (e, u) => {

        if(!e && u) {

          users.findOne({"username": referral.sponsor}, (es, s) => {

            if(!es && s) {

              users.update({"_id": u._id}, {"sponsorid" : s._id, "sponsorname" : (s.fname + '' + s.lname), "sponsorusername" : s.username}, (eu, u1) => {

                sponsor.update({"username": u.username, "userid": u._id + ''}, {"sponsorid" : s._id, "sponsor": s.username, "position": position}, (es, s1) => {

                  console.log('>>>>>>>> '+ (start + 1) +' Sponsor and User Updated >>>>>>>>', eu, es, u1, s1);
                  return that.updateUserSponsor(users, sponsor, obj, (start + 1), length)    

                });


              });

            }
            else {

              console.log('>>>>>>>> '+ (start + 1) +' No Sponsor Found >>>>>>>>');
              return that.updateUserSponsor(users, sponsor, obj, (start + 1), length)

            }

          })

        }
        else {
          console.log('>>>>>>>> '+ (start + 1) +' No User Found >>>>>>>>');
          return that.updateUserSponsor(users, sponsor, obj, (start + 1), length)
        }

      })


    } else {
      console.log('Process Done');
      return process.exit(0);
    }
  }

  execute() {
    let that = this;
    let referral = this.users.getReferral();

    referral.find({"$and": [{"_id": {"$gte": "59c25e414ba14fe0548a76c2"}}, {"_id": {"$lte": "59c270254ba14fe0548f952f"}}]}).sort({'_id': 1}).exec((e, u) => {
      if(!e || u) {

        let sponsor = this.users.getSponsor();
        let users = this.users.getUserModel();

        return that.updateUserSponsor(users, sponsor, u, 0, u.length);

      } else {
        process.exit(0);
      }
    });
  }
}

let taskServer = new TaskServer(8881);
taskServer.getServer((server) => {
  let binaryTask = new TaskPre(server);
  binaryTask.execute();
});