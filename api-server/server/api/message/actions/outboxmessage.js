'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class OutboxMessage extends ApiBaseActions {

  /**
   * Constructor
   * @param {Request} request 
   * @param {Replay} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req    = request;
    this.app    = request.server.settings.app;
    this.maxLen = 5;
  }

  /**
   * Generate Output
   * @param {Number} code 
   * @param {Object} data 
   * @param {Error} error 
   */
  out(code, data, error) {
    if(error) {
      super.logger.logError(error);
    }

    if(data.hasError) {
      super.logger.logWarning(data.message);
    }

    return super.response(code, data);
  }

  /**
   * 
   * @param {Number} request 
   * @param {Number} reply 
   * @param {Object} filter
   */
  __outBox(curPage, perPage, filter) {
    let that     = this;
    let message  = this.app.messages;
    let UserObj  = this.app.users;
    let user     = this.req.auth.credentials;
    let arrayLen = 5;

    message.outboxMessage(user.id, filter, curPage, perPage, function(e, m) {
      if(!e && m) {
        let length      = m.messages.length;
        let listMessage = [];
        let users       = '';

        for(let idx=0; idx<length; idx++) {
          let sentTo = m.messages[idx].sent_to.split(',');
          users = (users ? users+',' : '') + sentTo.slice(0, that.maxLen).toString();
        }
        users = Array.from(new Set(users.split(',')));
        UserObj.getSentToMessageUsers(users, function(eu, u) {
          for(let idx=0; idx<length; idx++) {
            let sentToUser = that.__userNameAndEmail(m.messages[idx].sent_to.split(','), (u ? u : []));
            listMessage.push({
              "id": m.messages[idx]._id,
              "subject": m.messages[idx].subject,
              "message": m.messages[idx].message,
              "toUserName": sentToUser.userName,
              "toUserEmail": sentToUser.userEmail,
              "createdAt": m.messages[idx].created_at,
              "showMore": (that.maxLen < m.messages[idx].sent_to.split(',').length)
            });
          }

          return that.out(200, {"hasError": false, "messages": listMessage, "totalRows": m.totalMessage, "currentPage": curPage, "perPage": perPage}, null);
        });
      }
      else {
        return that.out(200, {"hasError": true, "message": "No message found."}, e)
      }
    })
  }

  /**
   * Process Request
   */
  processRequest() {
    let that     = this;
    let message  = this.app.messages;
    let UserObj  = this.app.users;
    let user     = this.req.auth.credentials;
    let query    = this.req.query;
    let curPage  = (query.page ? query.page : 1);
    let perPage  = parseInt(process.env.PAGINATION_LIMIT);
    let filter   = (query.filter ? query.filter : null);
    let arrayLen = 5;

    if(filter === null) {
      return that.__outBox(curPage, perPage, null);
    }
    else {
      return UserObj.findByEmail(filter, (e, u) => {
        if(!e && u) {
          return that.__outBox(curPage, perPage, u.username);
        }
        else {
          return that.__outBox(curPage, perPage, filter);
        }
      });
    }
  }

  /**
   * 
   * @param {Array} sendTo
   * @param {Array} userList 
   */
  __userNameAndEmail(sentTo, userList) {
    let usrLen    = userList.length;
    let sToLen    = sentTo.length;
    let userName  = [];
    let userEmail = [];

    for(let idx1=0; idx1<this.maxLen; idx1++) {
      for(let idx2=0; idx2<usrLen; idx2++) {
        if(userList[idx2].username === sentTo[idx1]) {
          userName.push(userList[idx2].fname + ' ' + userList[idx2].lname);
          userEmail.push(userList[idx2].email);
        }
      }
    }

    if(sToLen > this.maxLen) {
      userName.push('...');
      userEmail.push('...');
    }

    return {
      "userName": userName.toString(),
      "userEmail": userEmail.toString()
    };
  }
}

module.exports = (request, reply) => {
  let outboxMessage = new OutboxMessage(request, reply);
  return outboxMessage.processRequest();
}