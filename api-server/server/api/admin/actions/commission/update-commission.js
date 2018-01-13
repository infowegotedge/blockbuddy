'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class UpdateCommission extends ApiBaseActions {

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
   * @param {Data} data 
   */
  out(code, data) {
    return super.response(code, data);
  }

  /**
   * Process Request
   */
  processRequest() {
    let Users      = this.app.users;
    let Commission = this.app.binaryCommission;
    let payload    = this.req.payload;
    let _s         = this;

    if(payload.commission >= 100) {
      return _s.out(200, {"hasError": true, "message": "Commission percentage should be less than 100%"});
    } else if(payload.commission < 0) {
      return _s.out(200, {"hasError": true, "message": "Commission percentage should be greater than 0."});
    } 

    return Commission.updateCommission(payload.commission_id, payload, (e, c) => {
      if(e) {
        return _s.out(200, {"hasError": true, "message": "No commission found for update."});
      }

      return _s.out(200, {"hasError": false, "message": "Commission updated successfully."});
    });
  }
}

module.exports = (request, reply) => {
  let updateCommission = new UpdateCommission(request, reply);
  return updateCommission.processRequest();
}