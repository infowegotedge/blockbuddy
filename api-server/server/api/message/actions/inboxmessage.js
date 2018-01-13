'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class InboxMessage extends ApiBaseActions {

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
   * @param {String} userId
   */
  __inbox(userId, type) {
    let that     = this;
    let message  = this.app.messages;
    let query    = this.req.query;
    let curPage  = (query.page ? query.page : 1);
    let perPage  = parseInt(process.env.PAGINATION_LIMIT);

    message.inboxMessage(userId, type, curPage, perPage, function(e, m) {
      if(!e && m) {
        let length      = m.messages.length;
        let listMessage = [];
        for(let idx=0; idx<length; idx++) {
          listMessage.push({
            "id": m.messages[idx]._id,
            "subject": m.messages[idx].subject,
            "message": m.messages[idx].message,
            "fromUserName": m.messages[idx].user_name,
            "formUserEmail": m.messages[idx].user_email,
            "createdAt": m.messages[idx].created_at,
            "status": m.messages[idx].status
          });
        }
        return that.out(200, {"hasError": false, "messages": listMessage, "totalRows": m.totalMessage, "totalUnread": m.totalUnread, "currentPage": curPage, "perPage": perPage}, null);
      }
      else {
        return that.out(200, {"hasError": true, "message": "No message found."}, e)
      }
    });
  }

  /**
   * Process Request
   */
  processRequest() {
    let that     = this;
    let users    = this.app.users;
    let message  = this.app.messages;
    let user     = this.req.auth.credentials;
    let query    = this.req.query;
    let filter   = (query.filter ? query.filter : null);

    if(!query.filter || query.filter === null) {
      return that.__inbox(user.displayName, (query.type || 0));
    }
    else {
      return users.findByEmail(filter, (e, u) => {
        if(!e && u) {
          return that.__inbox(u.username, (query.type || 0));
        }
        else {
          return that.__inbox(filter, (query.type || 0));
        }
      })
    }
  }
}

module.exports = (request, reply) => {
  let inboxMessage = new InboxMessage(request, reply);
  return inboxMessage.processRequest();
}