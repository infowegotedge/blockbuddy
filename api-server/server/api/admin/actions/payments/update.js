'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class UpdatePayments extends ApiBaseActions {

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
   * Process Request for Find Payments
   */
  processRequest() {
    let Payments = this.app.payment;
    let Users    = this.app.users;
    let payload  = this.req.payload;
    let _s       = this;

    Payments.update(payload, (e, t) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "message": 'Payment updated successfully.'});
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Payment not found."})
      }
    });
  }
}

module.exports = (request, reply) => {
  let updatePayments = new UpdatePayments(request, reply);
  return updatePayments.processRequest();
}