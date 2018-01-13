'use strict';

let ApiBaseActions    = require('./../../apibase.actions');
let ValidateComponent = require('./../../../component/validate');
let CoinBaseAPI       = require('./../../../component/coinbase_api');
let CoinbaseConfig    = require('./../../purchase/model/purchase.json');

// Affiliate Create Class
class AffiliatesCreate extends ApiBaseActions {

  /**
   * Constructor
   * @param {request} request 
   * @param {reply} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  /** 
   * Generate Output 
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
   * Private function to Output
   * @param {Object} thisObj 
   * @param {Callback} cb 
   * @param {Number} code 
   * @param {Object} data 
   */
  __printOutput(thisObj, cb, code, data) {

    if(typeof cb == 'undefined') {
      return thisObj.out(200, data, null);
    }
    else {
      return cb(code, data);
    }
  }

  /**
   * Get Request
   */
  doAffiliateRequest() {
    let that     = this;
    let auth     = this.req.auth.credentials;
    let Token    = this.app.tokenvalidator;
    let validate = new ValidateComponent(Token);

    validate.getRequestToken(auth.id, 'affiliate', function(e, t) {
      if(!e) {
        return that.out(200, {"hasError": false, "token": t}, null)  
      }
      return that.out(200, {"hasError": true, "message": t}, e)
    });
  }

  /**
   * Post Request
   */
  processRequest() {
    let Affiliates = this.app.affiliates;
    let Wallet     = this.app.wallet;
    let Token      = this.app.tokenvalidator;
    let Rates      = this.app.rates;
    let Auth       = this.req.auth.credentials;
    let payload    = this.req.payload;
    let _s         = this;
    let coinbase   = new CoinBaseAPI(CoinbaseConfig.coinbase.key, CoinbaseConfig.coinbase.secret);
    let validate   = new ValidateComponent(Token);
    let amount     = (this.app.ConfigSettings.affiliation_amount ? this.app.ConfigSettings.affiliation_amount : 0);
    let fee        = ((amount * (this.app.ConfigSettings.affiliation_fee ? this.app.ConfigSettings.affiliation_fee : 0)) / 100)
    let postData   = {
      "userid": Auth.id,
      "user_name": Auth.name,
      "user_email": Auth.email,
      "fee": fee,
      "paid": (amount + fee)
    };
    
    if(!this.app.ConfigSettings || (this.app.ConfigSetting && postData.paid < this.app.ConfigSettings.affiliation_amount)) {
      return _s.out(200, {"hasError": true, "message": "Affiliation fee is less then actual fee"}, null);
    }

    // Verify Request By Validate
    validate.verifyRequest(Auth.id, 'affiliate', payload.token, function(e, t) {
      if(e) {
        return _s.out(200, {"hasError": true, "message": t}, e);
      }
      else {
        let addressName = Auth.displayName + ' : ' + Auth.id + ' : ' + postData.paid;
        if(payload.paymethod === 'bitcoin') {
          postData.pay_through = 'bitcoin';
          postData.currency    = 'USD';
          postData.verified    = false;
          
          // Create Coin Base Address
          coinbase.createAddress(addressName, CoinbaseConfig.coinbase.accountId, function(e, a) {
            if(!e) {
              postData.from_btc_address = a.address;
              // Do Bitcoin Address
              return _s.__bitcoin(Affiliates, Wallet, Auth.id, postData, a);
            }
            else {
              return _s.out(200, {"hasError": true, "message": a}, e)
            }
          });
        }
        else if(payload.paymethod === 'wallet') {
          postData.pay_through = 'wallet';
          postData.currency    = 'BTC';
          postData.verified    = true;

          Rates.getRates(function(e, r) {
            if(!e) {
              postData.pay_btc = (postData.paid / parseFloat(r.rates));
              return _s.__wallet(Affiliates, Wallet, Auth.id, postData);
            }
            else {
              return _s.out(200, {"hasError": true, "message": "An error occurred, please try after some time."}, e)
            }
          });
        }
      }
    });
  }

  /**
   * Private method of bitcoin
   * @param {Object} Affiliates 
   * @param {Object} Wallet 
   * @param {String} userId 
   * @param {Object} postData 
   * @param {Object} addressObj 
   * @param {callback} cb 
   */
  __bitcoin(Affiliates, Wallet, userId, postData, addressObj, cb) {
    let _s = this;

    // Affiliates
    Affiliates.getInvoiceNo(userId, function(e, i) {
      if(!e) {
        Affiliates.save(postData, Wallet, function(e, a) {
          if(!e && a) {
            let message = 'Affiliate save successfully.';
            let output  = {
              "invoiceNumber": a.invoice_no,
              "name": a.user_name,
              "email": a.user_email,
              "fee": a.fee,
              "status": a.status,
              "paid": a.paid,
              "description": a.description,
              "created_at": a.created_at,
              "btc_address": (addressObj ? addressObj.address : null)
            };
            
            return _s.__printOutput(_s, cb, false, {"hasError": false, "affiliates": output, "message": message});
          }
          else {
            return _s.__printOutput(_s, cb, true, {"hasError": true, "message": (a || 'Error occurred, Please try after some time.')});
          }
        });
      }
      else {
        return _s.__printOutput(_s, cb, true, {"hasError": true, "message": i});
      }
    });
  }

  /**
   * Private Method
   * @param {Object} Affiliates 
   * @param {Object} Wallet 
   * @param {String} userId 
   * @param {Object} postData 
   */
  __wallet(Affiliates, Wallet, userId, postData) {
    let _s = this;

    Wallet.getBtcWallet(userId, function(e, w) {
      if(!e) {
        let btcAmount = 0;

        if(typeof w !== 'undefined' && w !== null && typeof w.btcamount !== 'undefined') {
          btcAmount = w.btcamount;
        }

        if(btcAmount < postData.pay_btc) {
          return _s.out(200, {"hasError": true, "message": "User wallet balance is low."}, null)
        }
        else {
          return _s.__bitcoin(Affiliates, Wallet, userId, postData, null, function(e, b) {
            return _s.out(200, b, e);
          });
        }
      }
      else {
        return _s.out(200, {"hasError": true, "message": "User wallet balance is low."}, e)
      }
    });
  }
}

module.exports = (request, reply) => {
  let creator = new AffiliatesCreate(request, reply);

  if(request.method == 'post') {
    return creator.processRequest();
  }
  
  return creator.doAffiliateRequest();
}