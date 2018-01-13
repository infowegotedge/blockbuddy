'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class MessageMarkRead extends ApiBaseActions {

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
    let that    = this;
    let message = this.app.messages;
    let payload = this.req.payload;

    message.markRead(payload.id, function(e, u) {
      if(e) {
        return that.out(200, {hasError: true, message: "Message not marked as read."}, e);
      }

      return that.out(200, {hasError: false, message: "Message marked as read."}, null)
    });
  }
}

module.exports = (request, reply) => {
  let creator = new MessageMarkRead(request, reply);
  return creator.processRequest();
}