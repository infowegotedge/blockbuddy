'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class AffiliatesUpdate extends ApiBaseActions {
  /**
   * Constructor
   * @param {Request} request 
   * @param {Reply} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  /**
   * Output Generator
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
    let Affiliates = this.app.affiliates;
    let Auth       = this.req.auth.credentials;
    let payload    = this.req.payload;
    let _s         = this;
    
    Affiliates.update(payload.number, function(e, a) {
      if(!e && a) {
        return _s.out(200, {"hasError": false, "message": "Affiliation update successfully."}, null);
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Affiliation not update"}, e);
      }
    });
  }
}

module.exports = (request, reply) => {
  let updateAffiliates = new AffiliatesUpdate(request, reply);
  return updateAffiliates.processRequest();
}