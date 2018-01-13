'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class MessageListUsers extends ApiBaseActions {

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
   * Process Request
   */
  processRequest() {
    let that     = this;
    let message  = this.app.messages;
    let UserObj  = this.app.users;
    let user     = this.req.auth.credentials;
    let payload  = this.req.payload.messageId;

    message.getMessageUserList(payload, user.id, function(e, m) {
      if(!e && m) {
        let msgUser = m.sent_to.split(',');
        UserObj.getSentToMessageUsers(msgUser, function(eu, u) {
          if(!e) {
            let listLength = u.length;
            let usersName  = [];
            let usersEmail = [];

            for(let idx=0; idx<listLength; idx++) {
              usersName.push(u[idx].fname.trim() + ' ' + u[idx].lname.trim());
              usersEmail.push(u[idx].email);
            }

            return that.out(200, {"hasError": false, "usersName": usersName.toString(), "usersEmail": usersEmail.toString()}, null);
          }
          else {
            return that.out(200, {"hasError": true, "message": "Unable to find message"}, e);
          }
        }) 
      }
      else {
        return that.out(200, {"hasError": true, "message": "Unable to find message"}, e);
      }
    })
  }
}

module.exports = (request, reply) => {
  let listUsers = new MessageListUsers(request, reply);
  return listUsers.processRequest();
}