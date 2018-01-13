'use strict';

let ApiBaseActions      = require('./../../apibase.actions');
let ValidateComponent   = require('./../../../component/validate');
let VerifyTwoFactorAuth = require('./../../../component/verify_two_factor');
let EmailNotification   = require('./../../../component/email-notification');

class WalletTransfer extends ApiBaseActions {

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
   * Process GET Request
   */
  doTransferRequest() {
    let that     = this;
    let auth     = this.req.auth.credentials;
    let Token    = this.app.tokenvalidator
    let Users    = this.app.users;
    let validate = new ValidateComponent(Token);

    validate.getRequestToken(auth.id, 'transfer', function(e, t) {
      if(!e) {
        Users.getUser(auth.id, (e, u) => {
          if(!e && u && u.enable_2fa && (u.enable_google || u.enable_authy)) {
            let externalType = (u.enable_google ? 'GOOGLE' : (u.enable_authy ? 'AUTHY' : null));
            let verify2FA    = new VerifyTwoFactorAuth(u.external_id, externalType);
            verify2FA.requestSMS((e, r) => {
              return that.out(200, {"hasError": false, "token": t}, null);
            });
          }
          else {
            return that.out(200, {"hasError": false, "token": t}, e);
          }
        });
      }
      else {
        return that.out(200, {"hasError": true, "message": 'Invalid transfer token request'}, e);
      }
    });
  }

  /**
   * Do Transfer Amount
   */
  __doTransfer() {
    let Transfer   = this.app.wallet;
    let Users      = this.app.users;
    let Affiliates = this.app.affiliates;
    let Products   = this.app.payment;
    let Ledger     = this.app.ledger;
    let auth       = this.req.auth.credentials;
    let payload    = this.req.payload;
    let Token      = this.app.tokenvalidator;
    let Notify     = this.app.messages;
    let Emails     = new EmailNotification(this.app.ConfigSettings);
    let validate   = new ValidateComponent(Token);
    let _s         = this;
    let userObj    = {
      "fname": auth.name.split(" ")[0]
    }

    validate.verifyRequest(auth.id, 'transfer', payload.token, function(e, t) {
      if(e) {
        return _s.out(200, {"hasError": true, "message": 'Invalid transfer token'});
      }
      else {
        let actualAmount = ((((payload.amount * 1) * (_s.app.ConfigSettings.transfer_fee * 1))) / 100);
            actualAmount = ((payload.amount * 1) + actualAmount);
        
        if(payload.transferForm === 'WALLET') {
          Users.findUserByUsername(payload.userid, (e, u) => {
            if(!e && u) {
              let transferAmount = {
                amount_transfer: payload.amount,
                amount_fee: (_s.app.ConfigSettings.transfer_fee * 1),
                amount: actualAmount,
                status: 'COMPLETED',
              }
  
              Transfer.transferAmount(auth.id, u._id, u.username, auth.displayName, transferAmount, Ledger, (ew, wa) => {
                if(!ew) {
                  transferAmount.userName = u.username;
                  Emails.sendMail(userObj, auth.email, 'BBApp: Fund Transfer', '/../emails/transfer-success.html', null, null, transferAmount, function(e, u) {
                    console.log(e, u);
                  });
  
                  Notify.saveNotification(auth.id, wa, (c, b) => {
                    return _s.out(200, {"hasError": false, "message": wa});
                  });
                }
                else {
                  return _s.out(200, {"hasError": true, "message": wa})
                }
              });
            }
            else {
              return _s.out(200, {"hasError": true, "message": 'Invalid User ID'})
            }
          });
        }
        else {
          Products.getProductById(payload.transferForm, (e, product) => {
            if(!e && product) {
              Ledger.productBalanceById(auth.id, payload.transferForm, (e, sum) => {
                if(e) {
                  return _s.out(200, {"hasError": true, "message": 'Balance is zero.'});
                }
                else if((!e && sum && sum.length === 0) || (!e && sum && sum.length > 0 && sum[0].total < actualAmount)) {
                  return _s.out(200, {"hasError": true, "message": 'Balance is less than amount (Including Trans. Changes)'});
                } 
                else if(!e && sum && sum.length > 0 && sum[0].total > actualAmount) {
                  Users.findUserByUsername(payload.userid, (e, u) => {
                    if(!e && u) {
                      let transferAmount = {
                        amount_transfer: payload.amount,
                        amount_fee: (_s.app.ConfigSettings.transfer_fee * 1),
                        amount: actualAmount,
                        status: 'COMPLETED',
                        transfer_type_name: product.name,
                        transfer_type_id: (product._id + '')
                      }

                      Transfer.transferProductAmount(auth.id, u._id, u.username, auth.displayName, transferAmount, product, Ledger, (ew, wa) => {
                        if(!ew) {
                          transferAmount.userName = u.username;
                          transferAmount.productName = product.name;
                          transferAmount.productCurrency = product.currency_code;
                          Emails.sendMail(userObj, auth.email, 'BBApp: Product Transfer', '/../emails/transfer-success-product.html', null, null, transferAmount, function(e, u) {
                            console.log(e, u);
                          });
          
                          Notify.saveNotification(auth.id, wa, (c, b) => {
                            return _s.out(200, {"hasError": false, "message": wa});
                          });
                        }
                        else {
                          return _s.out(200, {"hasError": true, "message": wa})
                        }
                      });
                    }
                    else {
                      return _s.out(200, {"hasError": true, "message": 'Invalid User ID'})
                    }
                  });
                }
                else {
                  return _s.out(200, {"hasError": true, "message": 'Error, Please try after sometime.'});
                }
              });
            }
            else {
              return _s.out(200, {"hasError": true, "message": 'Sorry, Balance is zero.'});
            }
          });
        }
      }
    });
  }

  // Verify Request
  __verifyTransfer() {
    let Transfer = this.app.wallet;
    let payload  = this.req.payload;
    let auth     = this.req.auth.credentials;
    let that     = this;

    return Transfer.sumDayTransfer(auth.id, (e, t) => {
      if(!e) {
        if(t && t.length === 0) {
          return that.__doTransfer();
        }
        else if(t && t.length > 0) {
          let coins = {}, btc = 0;
          for(let i in t) {
            if(t[i]._id != null) {
              coins[t[i]._id + ''] = t[i].total;
            }
            else {
              btc = t[i].total
            }
          }

          if(payload.transferForm === 'WALLET' && (payload.amount + btc) < that.app.ConfigSettings.transfer_per_user_day_limit) {
            return that.__doTransfer();
          }
          else if((payload.amount + (coins[payload.transferForm] || 0)) < that.app.ConfigSettings.transfer_per_user_day_limit_coin) {
            return that.__doTransfer();
          }
          else {
            return that.out(200, {"hasError": true, "message": "Daily transfer limit reach, Please try after 24 hours"});  
          }
        }
        else {
          return that.out(200, {"hasError": true, "message": "Daily transfer limit reach, Please try after 24 hours"});
        }
      }
      else {
        return that.out(200, {"hasError": true, "message": "Daily transfer limit reach, Please try after 24 hours"});
      }
    })
  }

  /**
   * Process Request
   */
  processRequest() {
    let auth    = this.req.auth.credentials;
    let payload = this.req.payload;
    let Users   = this.app.users;
    let that    = this;

    if(payload.amount < 0) {
      return that.out(200, {"hasError": true, "message": "Amount can't be negavite."}) 
    }
    else {
      Users.getUser(auth.id, (e, u) => {
        if(!e && u && u.enable_2fa && (u.enable_google || u.enable_authy)) {
          let externalType = (u.enable_google ? 'GOOGLE' : (u.enable_authy ? 'AUTHY' : null));
          let verify2FA    = new VerifyTwoFactorAuth(u.external_id, externalType);
          verify2FA.verifyRequest(payload.verifyToken+'', (e, r) => {
            if(!e) {
              return that.__verifyTransfer();
            }
            else {
              return that.out(200, {"hasError": true, "message": "Invalid two factor token. Request is cancelled."}) 
            }
          });
        }
        else {
          return that.__verifyTransfer();
        }
      });
    }
  }
}

module.exports = (request, reply) => {
  let walletTransfer = new WalletTransfer(request, reply);

  if(request.method == 'post') {
    return walletTransfer.processRequest();
  }
  
  return walletTransfer.doTransferRequest();
}