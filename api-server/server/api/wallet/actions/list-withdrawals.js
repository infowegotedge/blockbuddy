'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class WithdrawalsList extends ApiBaseActions {

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
    let auth    = this.req.auth.credentials
    let Wallet  = this.app.wallet;
    let Users   = this.app.users;
    let query   = this.req.query;
    let curPage = 1;
    let perPage = 10;
    let _s = this;

    Wallet.findWalletUser(auth.id, (curPage * 1), (perPage * 1), (e, w) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "withdrawals": w.withdrawals});
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Withdrawals not found."})
      }
    });
  }
}

module.exports = (request, reply) => {
  let withdrawalsList = new WithdrawalsList(request, reply);
  return withdrawalsList.processRequest();
}