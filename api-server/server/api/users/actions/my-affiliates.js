'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class MyAffiliates extends ApiBaseActions {

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
    let Users = this.app.users;
    let auth  = this.req.auth.credentials
    let _s    = this;

    Users.findNewAffiliates(auth.displayName, (e, a) => {
      if(!e) {
        _s.out(200, {"hasError": false, "myAffiliate": a})
      }
      else {
        return _s.out(200, {"hasError": true, "message": "No affiliates has found"}, e)
      }
    });
  }
}

module.exports = (request, reply) => {
  let myAffiliates = new MyAffiliates(request, reply);
  return myAffiliates.processRequest();
}