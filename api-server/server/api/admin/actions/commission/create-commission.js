'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class CreateCommission extends ApiBaseActions {

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
    let Commission = this.app.binaryCommission;
    let payload    = this.req.payload;
    let _s         = this;

    if(payload.commission >= 100) {
      return _s.out(200, {"hasError": true, "message": "Commission percentage should be less than 100%"});
    } else if(payload.commission < 0) {
      return _s.out(200, {"hasError": true, "message": "Commission percentage should be greater than 0."});
    } 

    return Commission.createCommission(payload, (e, c) => {
      if(e) {
        return _s.out(200, {"hasError": true, "message": "Commission can't created."});
      }

      return _s.out(200, {"hasError": false, "message": "Commission created successfully."});
    });
  }
}

module.exports = (request, reply) => {
  let createCommission = new CreateCommission(request, reply);
  return createCommission.processRequest();
}