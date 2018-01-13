'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class ListBroadCastNotifications extends ApiBaseActions {

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
    let query        = this.req.query;
    let curPage      = (query.page ? query.page : 1);
    let perPage      = (process.env.PAGINATION_LIMIT * 1);
    let _s           = this;

    return notification.broadCastNotification((curPage * 1), (perPage * 1), (e, c) => {
      if(e || !c || c.notifications.length === 0) {
        return _s.out(200, {"hasError": true, "message": c});
      }

      return _s.out(200, {"hasError": false, "notification": c.notifications, "totalRows": c.totalRows, "currentPage": curPage, "perPage": perPage});
    });
  }
}

module.exports = (request, reply) => {
  let listNotification = new ListBroadCastNotifications(request, reply);
  return listNotification.processRequest();
}