'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class TopAffiliates extends ApiBaseActions {

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
    let AffiliatesCount = this.app.AffiliatesCount;
    let Users           = this.app.users;
    let payload         = this.req.payload;
    let _s              = this;

    AffiliatesCount.findAffiliates(Users, process.env.AWS_PATH, (e, a) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "affiliates": a});
      }
      else {
        return _s.out(200, {"hasError": true, "message": a}, e);
      }
    })
  }
}

module.exports = (request, reply) => {
  let topAffiliates = new TopAffiliates(request, reply);
  return topAffiliates.processRequest();
}