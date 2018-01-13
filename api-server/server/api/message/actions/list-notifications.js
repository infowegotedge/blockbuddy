'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class ListNotifications extends ApiBaseActions {

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
    let that         = this;
    let notification = this.app.messages;
    let user         = this.req.auth.credentials;

    notification.userNotification(user.id, function(e, nt) {
      if(e) {
        return that.out(200, {hasError: true, message: nt}, e);
      }

      return that.out(200, { hasError: false, "notifications": nt.notifications, "totalRows": nt.totalRows }, null)
    });
  }
}

module.exports = (request, reply) => {
  let creator = new ListNotifications(request, reply);
  return creator.processRequest();
}