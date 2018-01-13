'use strict';

let ApiBaseActions    = require('./../../apibase.actions');
let PayzaAPI          = require('./../../../component/payza.service');
let Request           = require('request');
let EmailNotification = require('./../../../component/email-notification');

class PaymentPayzaIPNCall extends ApiBaseActions {

  /**
   * Constructor
   * @param {Request} request 
   * @param {Reply} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  /**
   * Output Generator
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
    let paymentData  = this.req.query;
    let notification = this.app.messages;
    let payments     = this.app.payment;
    let Users        = this.app.users;
    let Ledger       = this.app.ledger;
    let PayzaPayment = new PayzaAPI();
    let _s           = this;
    let status       = '';
    let Emails       = new EmailNotification(this.app.ConfigSettings);

    let formData1 = { 'token' : this.req.payload.token };
    let options1  = { 
      method: 'POST',
      url: 'https://secure.payza.com/ipn2.ashx',
      headers: { 
       'cache-control': 'no-cache',
       'content-type': 'application/json' 
      },
      strictSSL: false,
      formData: formData1
    };

    Request(options1, (e, httpResponse, body) => {
      
      if (body == 'INVALID TOKEN') {
        console.log('>>>>> IPN STATUS : INVALID TOKEN >>>> 1');
        return _s.out(200, {"hasError": true, "message": "INVALID TOKEN"}, true);
      } 
      else {
        let body1 = body.split('&');
        let bodyArray = {};
        body1.forEach((arg) => {
          let data = arg.split('=');
          bodyArray[data[0]] = data[1];
        })

        if (bodyArray['ap_status'] == 'Success') { 
          payments.getPaymentsByOderId(bodyArray['apc_1'], (e, payment) => {
            if(!e && payment && bodyArray['ap_discountamount'] == '0') {
              Users.getUser(payment.userid, (eu, user) => {
                if(!eu && user) {
                  let formData = {
                    "userName": user.username,
                    "sponsorUserName": user.sponsorusername,
                    "productSku": payment.product_id,
                    "orderTotal": payment.amount,
                    "gatewayResponse": body,
                    "orderID": bodyArray['apc_1']
                  };
    
                  Request.post({
                    url: process.env.TRADE_API_URL + '/product/sale/create?adminToken='+process.env.TRADE_ADMIN_TOKEN+'&adminPassword='+process.env.TRADE_ADMIN_PASSWORD,
                    form: formData
                  }, (e, httpResponse, body) => {
                    let p = (!e && body ? JSON.parse(body) : {});
    
                    if(!e && p && p.data) {
                      payments.updatePayments(bodyArray['apc_1'], 'COMPLETED', notification, Ledger, Users, (e, p) => {
    
                        Emails.sendMail(user, user.email, 'BlockBuddy: Purchase', '/../emails/purchase-email.html', null, null, {
                          'status': (!e ? 'Success' : 'Failure'),
                          'payment': payment
                        }, function(e, u) {
                          console.log(e, u);
                        });
    
                        if(!e) {
                          console.log('>>>>> IPN STATUS : SUCCESS', bodyArray['apc_1'], bodyArray);
                          return _s.out(200, {});
                        }
                        else {
                          console.log('>>>>> IPN STATUS : FAILURE', bodyArray['apc_1'], bodyArray);
                          return _s.out(200, {});
                        }
                      });
                    }
                    else {
                      payments.updatePayments(bodyArray['apc_1'], 'FAILED', notification, Ledger, Users, (e, p) => {
                        Emails.sendMail(user, user.email, 'BlockBuddy: Purchase', '/../emails/purchase-email.html', null, null, {
                          'status': 'Failure',
                          'payment': payment
                        }, function(e, u) {
                          console.log(e, u);
                        });
      
                        console.log('>>>>> IPN STATUS : FAILURE', bodyArray['apc_1'], bodyArray);
                        return _s.out(200, {});
                      });
                    }
                  });
                } 
                else {
                  payments.updatePayments(bodyArray['apc_1'], 'FAILED', notification, Ledger, Users, (e, p) => {
                    console.log('>>>>> IPN STATUS : FAILURE >>>> 1');
                    return _s.out(200, {});
                  });
                } 
              });
            }
            else {
              payments.updatePayments(bodyArray['apc_1'], 'FAILED', notification, Ledger, Users, (e, p) => {
                console.log('>>>>> IPN STATUS : FAILURE >>>>> 2');
                return _s.out(200, {});
              });
            }
          });
        } else {
          payments.updatePayments(bodyArray['apc_1'], 'FAILED', notification, Ledger, Users, (e, p) => {
            console.log('>>>>> IPN STATUS : FAILURE >>>>>> 3', bodyArray['apc_1'], bodyArray);
            return _s.out(200, {});
          });
        }
      }
    });
  }
}

module.exports = (request, reply) => {
  let paymentCall = new PaymentPayzaIPNCall(request, reply);
  return paymentCall.processRequest();
}
