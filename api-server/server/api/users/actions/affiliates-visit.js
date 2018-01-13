'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class AffiliatesVisit extends ApiBaseActions {

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

    Users.findUserByUsername(payload.username, (e, u) => {
      if(!e && u) {
        AffiliatesCount.updateVisitCount(u._id, u.username, (e, a) => {
          if(!e) {
            _s.out(200, {"hasError": false, "message": "Count Updated"})
          }
          else {
            return _s.out(200, {"hasError": true, "message": "Sponsor not found"}, e)
          }
        });
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Invalid Sponsor"}, e)
      }
    });
  }
}

module.exports = (request, reply) => {
  let affiliatesVisit = new AffiliatesVisit(request, reply);
  return affiliatesVisit.processRequest();
}