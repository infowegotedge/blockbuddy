'use strict';

const TaskServer = require('../tasks.server');
const User       = require('../server/api/auth/model/users.model');
const KYCUser    = require('../server/api/kyc/model/kyc.model');

class KYCCreateTask {

  constructor(server) {
    this.Users   = new User(server['plugins']['hapi-mongoose']);
    this.UserKYC = new KYCUser(server['plugins']['hapi-mongoose']);
  }

  getList(cb) {
    return this.Users.getUserModel().find().sort({"_id": 1, "created_at": 1}).exec(cb);
  }

  createKYC(data, index, length, kycArray, cb) {
    let that = this;

    if(data[index] && index < length) {
      let userData = data[index];

      that.UserKYC.create({
        'user': {'id': "" + userData._id, 'name': (userData.fname + ' ' + userData.lname), 'email': userData.email, 'mobile' : userData.mobile, 'govid': '', 'taxid': ''},
        'kyc_flag': "UNVERIFIED",
        'applied_on': '',
        'moderator': {'id': '', 'name': '', 'flag':  "UNVERIFIED", 'timestamp': '', 'comments': '', 'comments_share': false, 'viewed': false},
        'admin': {'flag':  "UNVERIFIED", 'viewed': false, 'timestamp': '', 'comments': ''},
        's3asset': {'selfie': '', 'id_1': '', 'id_2': '', 'id_3':  '', 'id_4':  ''},
        'has_multiple_ids': false,
        'created_at': '',
        'updated_at': ''
      }, (e, kyc) => {
        console.log(e, kyc);
        return that.createKYC(data, (index+1), length, [], cb);
      });
    }
    else {
      return cb(false, 'Process Done');
    }
  }

  execute() {
    let that = this;
    
    this.getList((err, ul) => {
      if(err || ul.length === 0) {
        console.log(err, 'No data found.');
        process.exit(0);
      }
      else {
        that.createKYC(ul, 0, ul.length, [], (e, c) => {
          console.log(e, c);
          process.exit(0);
        });
      }
    });
  }
}

let taskServer = new TaskServer(8100);
taskServer.getServer((server) => {
  let kycCreateTask = new KYCCreateTask(server);
  kycCreateTask.execute();
});