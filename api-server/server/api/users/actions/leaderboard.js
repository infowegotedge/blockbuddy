'use strict';

let ApiBaseActions = require('./../../apibase.actions');
let moment         = require('moment');

class LeaderBoard extends ApiBaseActions {

  /**
   * Constructor
   * @param {Request} request 
   * @param {Replay} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  /**
   * Generate Output
   * @param {Number} code 
   * @param {Object} data  
   */
  out(code, data) {
    return super.response(code, data);
  }

  /**
   * Process Request
   */
  processRequest() {
    let Users    = this.app.users;
    let that     = this;
    let userList = [];
    let currentD = moment().valueOf()
    let sevenDay = moment().subtract(7, "days").valueOf();
    let oneMonth = moment().subtract(1, "months").valueOf();
    let limit    = parseInt(process.env.PAGINATION_LIMIT);

    Users.getLast7OR30Days({"min": sevenDay, "max": currentD}, limit, function(e, u7) {
      let sevenDays = (u7 || []);
      let sevenDayC = sevenDays.length;
      Users.getLast7OR30Days({"min": oneMonth, "max": currentD}, limit, function(e, u30) {
        let oneMonth  = (u30 || []);
        let oneMonthC = oneMonth.length;
        Users.getAllTimeLeaderBoard(limit, function(e, uAll) {
          let complete  = (uAll || []);
          let completeC = complete.length;
          let allUsers  = [];

          allUsers = that.__allUsersId(allUsers, sevenDayC, sevenDays);
          allUsers = that.__allUsersId(allUsers, oneMonthC, oneMonth);
          allUsers = that.__allUsersId(allUsers, completeC, complete);

          Users.getUsersByIds(allUsers, function(u, info) {
            let infoLength     = (info && info.length ? info.length : 0);
            let sevenDaysUsers = that.__users(infoLength, info, sevenDayC, sevenDays);
            let oneMonthUsers  = that.__users(infoLength, info, oneMonthC, oneMonth);
            let completeUsers  = that.__users(infoLength, info, completeC, complete);

            return that.out(200, {"hasError": false, "last7days": sevenDaysUsers, "last30Days": oneMonthUsers, "allUsers": completeUsers});
          });
        });
      });
    });
  }

  __allUsersId(allUsers, idxLen, members) {

    for(let idx = 0; idx < idxLen; idx ++) {
      if(allUsers.indexOf(members[idx]._id+'') === -1) {
        allUsers.push(members[idx]._id+'');
      }
    }

    return allUsers;
  }

  __users(infoLength, info, memberLength, member) {
    let members = [];

    for(let idx1 = 0; idx1 < memberLength; idx1++) {
      for(let idx = 0; idx < infoLength; idx ++) {
        if(member[idx1]._id+'' === info[idx]._id+'') {
          members.push({
            "username": info[idx].username,
            "name": info[idx].fname.trim() + ' ' + info[idx].lname.trim(), 
            "country": info[idx].country,
            "members": member[idx1].count
          });
        }
      }
    }

    return members;
  }
}

module.exports = (request, reply) => {
  let leaderBoard = new LeaderBoard(request, reply);
  return leaderBoard.processRequest();
}