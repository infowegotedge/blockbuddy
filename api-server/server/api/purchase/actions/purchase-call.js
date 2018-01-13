'use strict';

let ApiBaseActions = require('./../../apibase.actions');
let CoinBaseAPI    = require('./../../../component/coinbase_api');
let Coinpayments   = require('coinpayments');
let ExpayAPI       = require('./../../../component/expay_api');
let PurcahseConfig = require('./../model/purchase.json');
let Request        = require('request');
let EmailNotification = require('./../../../component/email-notification');

class PaymentCall extends ApiBaseActions {

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
    let Expay        = new ExpayAPI();
    let _s           = this;
    let status       = '';
    let Emails       = new EmailNotification(this.app.ConfigSettings);

    Expay.getTransaction(paymentData, (e, t) => {

      if(!e) {
        switch (t['response']['status']) {
          case 201:
            status = 'PROCESSING_QUEUE';
            break;
          case 203:
            status = 'PAYMENT_PROCESSING';
            break;
          case 204:
            status = 'PAYMENT_REJECTED';
            break;
          case 205:
            status = 'COMPLETED';
            break;
          case 206:
            status = 'WAITING_PAYER';
            break;
          case 207:
            status = 'PAYMENT_RETURNED';
            break;
          case 999:
            status = 'UNKNOWN_STATUS';
            break;
        };

        payments.getPaymentsByOderId(paymentData.order, (e, payment) => {
          if(!e && payment) {
            Users.getUser(payment.userid, (eu, user) => {
              if(!eu && user) {
                let formData = {
                  "userName": user.username,
                  "sponsorUserName": user.sponsorusername,
                  "productSku": payment.product_id,
                  "orderTotal": parseFloat(t['response']['amount']),
                  "gatewayResponse": JSON.stringify(t['response']),
                  "orderID": paymentData.order
                };

                Request.post({
                  url: process.env.TRADE_API_URL + '/product/sale/create?adminToken='+process.env.TRADE_ADMIN_TOKEN+'&adminPassword='+process.env.TRADE_ADMIN_PASSWORD,
                  form: formData
                }, (e, httpResponse, body) => {
                  let p = (!e && body ? JSON.parse(body) : {});

                  if(!e && p && p.data) {
                    payments.updatePayments(paymentData.order, status, notification, Ledger, Users, (e, p) => {

                      Emails.sendMail(user, user.email, 'BlockBuddy: Purchase', '/../emails/purchase-email.html', null, null, {
                        'status': (!e ? 'Success' : 'Failure'),
                        'payment': payment
                      }, function(e, u) {
                        console.log(e, u);
                      });

                      if(!e) {
                        return _s.tempRedirect(process.env.APP_REDIRECT + 'success');
                      }
                      else {
                        return _s.tempRedirect(process.env.APP_REDIRECT + 'failure');
                      }
                    });
                  }
                  else {
                    Emails.sendMail(user, user.email, 'BlockBuddy: Purchase', '/../emails/purchase-email.html', null, null, {
                      'status': 'Failure',
                      'payment': payment
                    }, function(e, u) {
                      console.log(e, u);
                    });

                    return _s.tempRedirect(process.env.APP_REDIRECT + 'failure');
                  }
                });
              } 
              else {
                return _s.tempRedirect(process.env.APP_REDIRECT + 'failure');
              } 
            });
          }
          else {
            return _s.tempRedirect(process.env.APP_REDIRECT + 'failure');
          }
        });
      }
      else {
        return _s.tempRedirect(process.env.APP_REDIRECT + 'failure');
      };
    });
  }
}

module.exports = (request, reply) => {
  let paymentCall = new PaymentCall(request, reply);
  return paymentCall.processRequest();
}
