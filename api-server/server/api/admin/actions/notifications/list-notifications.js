'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class ListNotifications extends ApiBaseActions {

  /**
   * 
   * @param {Request} request 
   * @param {Reply} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  /**
   * 
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
    let notification = this.app.messages;
    let Users        = this.app.users;
    let _s           = this;

    return notification.adminNotification((e, c) => {
      if(e || !c || c.length === 0) {
        return _s.out(200, {"hasError": true, "message": c});
      }

      let userIds = [];
      for(let idx in c) {
        userIds.push(c[idx].userid);
      }

      return Users.getUsersByIds(userIds, (e, u) => {
        if(e || !u || u.length === 0) {
          return _s.out(200, {"hasError": true, "message": "Notification not found"});
        }

        let notifications = [];
        for(let idx in c) {
          let user = _s.filterById(u, c[idx].userid);
          notifications.push({
            "name": ((user && user[0]) ? (user[0].fname + ' ' + user[0].lname) : ''),
            "username": ((user && user[0]) ? user[0].username : ''),
            "message": c[idx].message,
            "created_at": c[idx].created_at
          });
        }

        return _s.out(200, {"hasError": false, "notification": notifications});
      });
    });
  }
}

module.exports = (request, reply) => {
  let listNotification = new ListNotifications(request, reply);
  return listNotification.processRequest();
}