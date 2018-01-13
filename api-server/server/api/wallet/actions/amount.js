'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class WalletGetValue extends ApiBaseActions {

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
    let Wallet = this.app.wallet;
    let auth   = this.req.auth;
    let _s     = this;

    Wallet.getUSDWallet(auth.credentials.id, function(e, w) {
      if(!e) {
        let wallet = {
          "amount": 0
        };

        if(typeof w !== 'undefined' && w !== null && typeof w.amount !== 'undefined') {
          wallet.amount = w.amount;
        }

        return _s.out(200, {"hasError": false, "wallet": wallet}, null)
      }
      else {
        return _s.out(200, {"hasError": true, "message": "User USD Wallet info not found"}, e)
      }
    });
  }
}

module.exports = (request, reply) => {
  let walletValue = new WalletGetValue(request, reply);
  return walletValue.processRequest();
}