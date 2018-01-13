'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class NotificationCounts extends ApiBaseActions {

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
    let Payments = this.app.payment;
    let Wallets  = this.app.wallet;
    let KYC      = this.app.kyc;
    let Users    = this.app.users;
    let _s       = this;

    return Payments.newPaymentsCount((ep, p) => {
      return Wallets.newWalletCount((ew, w) => {
        return KYC.newKycCount((ekyc, kyc) => {
          return Users.newListCount((eu, user) => {
            return _s.out(200, {"hasError": false, "payments": p, "withdrawals": w, "kycCount": kyc, "users": user});
          });
        });
      })
    });
  }
}

module.exports = (request, reply) => {
  let notificationCount = new NotificationCounts(request, reply);
  return notificationCount.processRequest();
}