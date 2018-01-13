'use strict';

let ApiBaseActions      = require('./../../apibase.actions');
let ValidateComponent   = require('./../../../component/validate');
let VerifyTwoFactorAuth = require('./../../../component/verify_two_factor');
let EmailNotification   = require('./../../../component/email-notification');

class WalletWithdrawal extends ApiBaseActions {

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
  doWithdrawalRequest() {
    let that     = this;
    let auth     = this.req.auth.credentials;
    let Token    = this.app.tokenvalidator
    let Users    = this.app.users;
    let validate = new ValidateComponent(Token);

    validate.getRequestToken(auth.id, 'withdrawal', function(e, t) {
      if(!e) {
        Users.getUser(auth.id, (e, u) => {
          if(!e && u && u.enable_2fa && (u.enable_google || u.enable_authy)) {
            let externalType = (u.enable_google ? 'GOOGLE' : (u.enable_authy ? 'AUTHY' : null));
            let verify2FA    = new VerifyTwoFactorAuth(u.external_id, externalType);
            verify2FA.requestSMS((e, r) => {
              return that.out(200, {"hasError": false, "token": t});
            });
          }
          else {
            return that.out(200, {"hasError": false, "token": t});
          }
        });
      }
      else {
        return that.out(200, {"hasError": true, "message": 'Invalid withdrawal token request'});
      }
    });
  }

  /**
   * Verify Withdrawal Request And Create
   */
  __verifyWithdrawal() {
    let Wallet     = this.app.wallet;
    let Affiliates = this.app.affiliates;
    let Rates      = this.app.rates;
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

    validate.verifyRequest(auth.id, 'withdrawal', payload.token, function(e, t) {
      if(e) {
        return _s.out(200, {"hasError": true, "message": 'Invalid withdrawal token'}, e);
      }
      else {
        let actualAmount = ((((payload.amount * 1) * (_s.app.ConfigSettings.withdrawal_fee * 1))) / 100);
            actualAmount = (payload.amount * 1) + actualAmount;
        
        let withdrawal   = {
          amount_withdrawal: payload.amount,
          amount_fee: (_s.app.ConfigSettings.withdrawal_fee * 1),
          amount: actualAmount,
          status: 'PENDING',
          user_name: auth.name
        }

        withdrawal.auto_withdraw = (withdrawal.amount_withdrawal <= _s.app.ConfigSettings.withdrawal_auto_limit);
        Wallet.withdrawalAmount(auth.id, withdrawal, Ledger, (ew, wa) => {
          if(!ew) {
            withdrawal.btc_address = wa.btc_address
            Emails.sendMail(userObj, auth.email, 'BBApp: Withdrawal Amount', '/../emails/withdrawal-pending.html', null, null, withdrawal, function(e, u) {
              console.log(e, u);
            });
            
            Notify.saveNotification(auth.id, "Transaction is successfully completed.", (c, b) => {
              return _s.out(200, {"hasError": false, "message": "Transaction is successfully completed. Please wait while your transaction will take effect."}, null);
            });
          }
          else {
            return _s.out(200, {"hasError": true, "message": wa}, ew)
          }
        });
      }
    });
  }

  /**
   * Process POST Request
   */
  processRequest() {
    let auth               = this.req.auth.credentials;
    let payload            = this.req.payload;
    let Users              = this.app.users;
    let minWithdrawalLimit = this.app.ConfigSettings.withdrawal_min_limit;
    let maxWithdrawalLimit = this.app.ConfigSettings.withdrawal_max_limit;
    let that               = this;
    
    if(payload.amount < minWithdrawalLimit) {
      return that.out(200, {"hasError": true, "message": "Minimum BTC amount to withdrawal is " + minWithdrawalLimit + " BTC"}, null)
    }
    else if (payload.amount > maxWithdrawalLimit) {
      return that.out(200, {"hasError": true, "message": "Max Withdrawal limit in a day is " + maxWithdrawalLimit + " BTC"}, null)
    }
    else {
      Users.getUser(auth.id, (e, u) => {
        if(!e && u && u.enable_2fa && (u.enable_google || u.enable_authy)) {
          let externalType = (u.enable_google ? 'GOOGLE' : (u.enable_authy ? 'AUTHY' : null));
          let verify2FA    = new VerifyTwoFactorAuth(u.external_id, externalType);
          verify2FA.verifyRequest(payload.verifyToken+'', (e, r) => {
            if(!e) {
              return that.__verifyWithdrawal();
            }
            else {
              return that.out(200, {"hasError": true, "message": "Invalid two factor token. Request is cancelled."}, e) 
            }
          });
        }
        else {
          return that.__verifyWithdrawal();
        }
      });
    }
  }
}

module.exports = (request, reply) => {
  let walletWithdrawal = new WalletWithdrawal(request, reply);

  if(request.method == 'post') {
    return walletWithdrawal.processRequest();
  }
  
  return walletWithdrawal.doWithdrawalRequest();
}