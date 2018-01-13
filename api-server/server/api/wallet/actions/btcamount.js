'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class BTCWalletGetValue extends ApiBaseActions {

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
        let btcWallet = {
          "btcAddress": '',
          "btcAmount": 0
        };

        if(typeof w !== 'undefined' && w !== null && typeof w.btcamount !== 'undefined') {
          btcWallet.btcAmount = w.btcamount;
        }

        if (typeof w !== 'undefined' && w !== null && typeof w.btcaddress !== 'undefined') {
          btcWallet.btcAddress = w.btcaddress;
        }

        return _s.out(200, {"hasError": false, "btcWallet": btcWallet}, null)
      }
      else {
        return _s.out(200, {"hasError": true, "message": "User BTC info not found"}, e)
      }
    });
  }
}

module.exports = (request, reply) => {
  let btcWallet = new BTCWalletGetValue(request, reply);
  return btcWallet.processRequest();
}