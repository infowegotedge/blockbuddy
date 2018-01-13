'use strict';

let ApiBaseActions    = require('./../../apibase.actions');
let PayzaAPI          = require('./../../../component/payza.service');
let Request           = require('request');
let EmailNotification = require('./../../../component/email-notification');

class PaymentPayzaCall extends ApiBaseActions {

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

    if(paymentData.type === 'success') {
      return _s.tempRedirect(process.env.APP_REDIRECT + 'success/' + paymentData.order_id);

      // payments.getPaymentsByOderId(paymentData.order_id, (e, payment) => {
      //   if(!e && payment) {
      //     Users.getUser(payment.userid, (eu, user) => {
      //       if(!eu && user) {
      //         let formData = {
      //           "userName": user.username,
      //           "sponsorUserName": user.sponsorusername,
      //           "productSku": payment.product_id,
      //           "orderTotal": payment.amount, // parseFloat(t['response']['amount']),
      //           "gatewayResponse": '', // JSON.stringify(t['response']),
      //           "orderID": paymentData.order_id
      //         };

      //         Request.post({
      //           url: process.env.TRADE_API_URL + '/product/sale/create?adminToken='+process.env.TRADE_ADMIN_TOKEN+'&adminPassword='+process.env.TRADE_ADMIN_PASSWORD,
      //           form: formData
      //         }, (e, httpResponse, body) => {
      //           let p = (!e && body ? JSON.parse(body) : {});

      //           if(!e && p && p.data) {
      //             payments.updatePayments(paymentData.order_id, 'COMPLETED', notification, Ledger, Users, (e, p) => {

      //               Emails.sendMail(user, user.email, 'BlockBuddy: Purchase', '/../emails/purchase-email.html', null, null, {
      //                 'status': (!e ? 'Success' : 'Failure'),
      //                 'payment': payment
      //               }, function(e, u) {
      //                 console.log(e, u);
      //               });

      //               if(!e) {
      //                 return _s.tempRedirect(process.env.APP_REDIRECT + 'success/' + payment.order_id);
      //               }
      //               else {
      //                 return _s.tempRedirect(process.env.APP_REDIRECT + 'failure');
      //               }
      //             });
      //           }
      //           else {
      //             Emails.sendMail(user, user.email, 'BlockBuddy: Purchase', '/../emails/purchase-email.html', null, null, {
      //               'status': 'Failure',
      //               'payment': payment
      //             }, function(e, u) {
      //               console.log(e, u);
      //             });

      //             return _s.tempRedirect(process.env.APP_REDIRECT + 'failure');
      //           }
      //         });
      //       } 
      //       else {
      //         return _s.tempRedirect(process.env.APP_REDIRECT + 'failure');
      //       } 
      //     });
      //   }
      //   else {
      //     return _s.tempRedirect(process.env.APP_REDIRECT + 'failure');
      //   }
      // });
    } 
    else {
      // payments.updatePayments(paymentData.order_id, 'FAILED', notification, Ledger, Users, (e, p) => {
        return _s.tempRedirect(process.env.APP_REDIRECT + 'failure');
      // });
    }
  }
}

module.exports = (request, reply) => {
  let paymentCall = new PaymentPayzaCall(request, reply);
  return paymentCall.processRequest();
}
