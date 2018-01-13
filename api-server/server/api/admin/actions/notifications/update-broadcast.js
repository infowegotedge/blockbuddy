'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class UpdateBroadCastNotifications extends ApiBaseActions {

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

    return notification.updateBroadCastNotification(payload.messageId, (e, c) => {
      if(e) {
        return _s.out(200, {"hasError": true, "message": c});
      }

      return _s.out(200, {"hasError": false, "message": "Updated successfully."});
    });
  }
}

module.exports = (request, reply) => {
  let updateNotification = new UpdateBroadCastNotifications(request, reply);
  return updateNotification.processRequest();
}