'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class UpdateAffiliates extends ApiBaseActions {

  /**
   * 
   * @param {Request} request 
   * @param {Reply} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  /**
   * 
   * @param {Number} code 
   * @param {Object} data 
   */
  out(code, data) {
    return super.response(code, data);
  }

  /**
   * Process Request
   */
  processRequest() {
    let Affiliates = this.app.affiliates;
    let payload    = this.req.payload;
    let _s         = this;

    return Affiliates.updateByAdmin(payload.id, payload.status, (e, r) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "message": "Affiliates updated."});
      }
      return _s.out(200, {"hasError": true, "message": "Affiliates not found."})
    });
  }
}

module.exports = (request, reply) => {
  let updateAffiliates = new UpdateAffiliates(request, reply);
  return updateAffiliates.processRequest();
}