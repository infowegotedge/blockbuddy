'use strict';

let ApiBaseActions = require('./../../apibase.actions');
// let CoinbaseAPI    = require('./../../../component/coinbase_api');
// let CoinbaseConfig = require('./../../purchase/model/purchase.json');

class BTCWalletCreate extends ApiBaseActions {

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
    let Wallet   = this.app.wallet;
    let Users    = this.app.users;
    let payload  = this.req.payload;
    let auth     = this.req.auth;
    let _s       = this;
    
    // Get User
    Users.getUser(auth.credentials.id, function(eu, u) {
      if(!eu) {
        // Get Wallet
        Wallet.getWallet(auth.credentials.id, payload.btcaddress, function(we, w) {
          if(!we && w.length === 0) {
            let amounts = {"btcAmount": 0, "amount": 0, "currency": 'USD'};
            // Create BTC Wallet
            Wallet.createBtcWallet(auth.credentials.id, payload.btcaddress, amounts, function(e, w) {
              if(e) {
                return _s.out(200, {"hasError": true, "message": w}, e);
              }
              else {
                return _s.out(200, {"hasError": false, "message": "BTC Wallet Created"}, null)
              }
            });
          }
          else if(!we) {
            return _s.out(200, {"hasError": false, "message": "BTC address is already exists."}, null);
          }
          else {
            return _s.out(200, {"hasError": true, "message": 'An error occurred, Please try after sometime.'}, we);
          }
        });
      }
      else {
        return _s.out(200, {"hasError": true, "message": 'An error occurred, Please try after sometime.'}, eu);
      }
    });
  }
}

module.exports = (request, reply) => {
  let btcWalletCreate = new BTCWalletCreate(request, reply);
  return btcWalletCreate.processRequest();
}