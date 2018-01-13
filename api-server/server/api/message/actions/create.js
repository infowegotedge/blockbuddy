'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class MessageCreate extends ApiBaseActions {

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
    let user    = this.req.auth.credentials;

    payload.userid     = user.id;
    payload.user_name  = user.name;
    payload.user_email = user.email;
    payload.status     = 1;
    payload.sent_to    = payload.sent_to.toString();

    message.save(payload, function(e, u) {
      if(e) {
        return that.out(200, {hasError: true, message: "Message not created."}, e);
      }

      return that.out(200, {hasError: false, message: "Message is created successfully."}, null)
    });
  }
}

module.exports = (request, reply) => {
  let creator = new MessageCreate(request, reply);
  return creator.processRequest();
}