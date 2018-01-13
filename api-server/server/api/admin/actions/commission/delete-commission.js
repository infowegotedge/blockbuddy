'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class ListCommission extends ApiBaseActions {

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
    let Commission = this.app.binaryCommission;
    let payload    = this.req.payload;
    let _s         = this;

    return Commission.deleteCommission(payload.id, (e, c) => {
      if(e) {
        return _s.out(200, {"hasError": true, "message": "Commission not found."});
      }

      return _s.out(200, {"hasError": false, "message": "Commission deleted successfully."});
    });
  }
}

module.exports = (request, reply) => {
  let listCommission = new ListCommission(request, reply);
  return listCommission.processRequest();
}