'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class LatestSignup extends ApiBaseActions {

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
    let _s    = this;
    
    Users.getLatestSignup(function(e, u) {
      if(e) {
        return _s.out(200, {"hasError": true, "message": 'Detail not found'}, e)
      }
      else {
        Users.getLatestSignupCount(function(e, c) {
          return _s.out(200, {"hasError": false, "latestSignup": u, "totalUsers": c}, null)
        });
      }
    });
  }
}

module.exports = (request, reply) => {
  let latestsignup = new LatestSignup(request, reply);
  return latestsignup.processRequest();
}