'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class UserPosition extends ApiBaseActions {

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
    let Positions = this.app.position;
    let userId    = this.req.auth.credentials.id;
    let payload   = this.req.payload;
    let _s        = this;

    Positions.updatePositions(userId, payload.position, (e, ps) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "message": "Position is save successfully."}, null);
      }
      else {
        return _s.out(200, {"hasError": true, "message": ps}, e);
      }
    });
  }
}

module.exports = (request, reply) => {
  let userPosition = new UserPosition(request, reply);
  return userPosition.processRequest();
}