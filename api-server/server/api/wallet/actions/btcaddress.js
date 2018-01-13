'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class BTCWalletGet extends ApiBaseActions {

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

    Wallet.getBtcWallet(auth.credentials.id, function(e, w) {
      if(!e) {
        let btcWallet = w;
        if(
          (typeof btcWallet === 'undefined' || btcWallet === null) || 
          (typeof btcWallet !== 'undefined' && btcWallet !== null && typeof btcWallet.btcaddress === 'undefined')
        ) {
          btcWallet = '';
        }
        else {
          btcWallet = btcWallet.btcaddress;
        }

        return _s.out(200, {"hasError": false, "btcAddress": btcWallet}, null)
      }
      else {
        return _s.out(200, {"hasError": true, "message": "User BTC info not found"}, e)
      }
    });
  }
}

module.exports = (request, reply) => {
  let btcWallet = new BTCWalletGet(request, reply);
  return btcWallet.processRequest();
}