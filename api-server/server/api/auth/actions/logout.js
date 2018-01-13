'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class Logout extends ApiBaseActions {

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
    let auth  = this.req.auth;
    let Token = this.app.verifytoken;
    let _s    = this;
    
    Token.deleteToken(auth.artifacts, function(e, t) {
      if(!e) {
        return _s.out(200, {"hasError": false, "message": 'Successfully logout.'}, null);
      }
      else {
        return _s.out(200, {"hasError": true, "message": 'Unable to logout.'}, e);
      }
    })
  }
}

module.exports = (request, reply) => {
  let logout = new Logout(request, reply);
  return logout.processRequest();
}