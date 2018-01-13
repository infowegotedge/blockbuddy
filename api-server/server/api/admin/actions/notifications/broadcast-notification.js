'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class BroadCastNotifications extends ApiBaseActions {

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
    let payload      = this.req.payload;
    let _s           = this;

    return notification.saveAdminNotification(payload.message, (e, n) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "message": "Notification is save successfully."})
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Notification can't save."});
      }
    });
  }
}

module.exports = (request, reply) => {
  let broadCastNotification = new BroadCastNotifications(request, reply);
  return broadCastNotification.processRequest();
}