'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class BTCWalletUpdate extends ApiBaseActions {

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
    let Wallet  = this.app.wallet;
    let auth    = this.req.auth;
    let payload = this.req.payload
    let _s      = this;

    Wallet.updateBtcWallet(auth.credentials.id, payload.btcaddress, function(e, w) {
      if(e) {
        return _s.out(200, {"hasError": true, "message": w}, e)
      }
      else {
        return _s.out(200, {"hasError": false, "message": "User BTC Address Update."}, null)
      }
    })
  }
}

module.exports = (request, reply) => {
  let btcWalletUpdate = new BTCWalletUpdate(request, reply);
  return btcWalletUpdate.processRequest();
}