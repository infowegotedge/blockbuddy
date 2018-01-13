'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class SponsorInfo extends ApiBaseActions {

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
    let Users   = this.app.users;
    let payload = this.req.payload;
    let _s      = this;

    Users.findSponsorUser(payload.sponsor, function(e, u) {
      if(!e && !u) {
        return _s.out(200, {"hasError": true, "message": "Invalid Sponsor User."}, e);
      }
      else {
        return _s.out(200, {"hasError": false, "sponsor": {
          "username": u.username,
          "name": (u.fname.trim() + ' ' + u.lname.trim())
        }}, null);
      }
    });
  }
}

module.exports = (request, reply) => {
  let sponsorInfo = new SponsorInfo(request, reply);
  return sponsorInfo.processRequest();
}
