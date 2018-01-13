'use strict';

let ApiBaseActions = require('./../../apibase.actions');
let PayzaAPI       = require('./../../../component/payza.service');
const Request      = require('request');

class PaymentPayzaCreate extends ApiBaseActions {

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
    let that         = this;
    let purchase     = this.app.purchase;
    let payment      = this.app.payment;
    let notification = this.app.messages;
    let Ledger       = this.app.ledger;
    let payload      = this.req.payload;
    let auth         = this.req.auth;
    let PayzaPayment = new PayzaAPI();

    let createdAt = (new Date()).toISOString()
    let paymentRow = {
      userid: auth.credentials.id,
      name: auth.credentials.displayName,
      // qunitity: payload.quantity,
      // price: payload.price,
      // amount: payload.amount,
      status: "PROCESSING",
      order_id: payload.order_id,
      purchase_id: payload.purchase,
      created_at: createdAt,
      updated_at: createdAt,
      payment_type: payload.payment_type,
      amount_fee: 0,
      product_name: payload.name,
      actual_id: payload.productId
    };

    if(payload.amount <= 0) {
      return that.out(200, {"hasError": true, "message": "Unable to place order."});
    }

    // Trade APP Product INFO
    Request.get(process.env.TRADE_API_URL + '/product/' + payload.productId, (e, http, body) => {
      let p = (!e && body ? JSON.parse(body) : {});

      // console.log('PayLoad: ', payload, 'Trade APP Response: ', p, 'Payment Row: ', paymentRow);
      // return that.out(200, {"hasError": true, "message": "Unable to place order."});
      
      if(!e && p && p.data && p.data.productSku) {
        paymentRow["product_id"] = p.data.productSku;
        paymentRow["price"]      = p.data.sellingPrice;

        for(let idx in p.data.compensationWallet) {
          if(p.data.compensationWallet[idx].currencyCode === 'BKN') {
            paymentRow["qunitity"] = p.data.compensationWallet[idx].total;
          }
        }

        paymentRow['amount'] = p.data.sellingPrice;

        payment.savePayZaPayments(paymentRow, Ledger, function(e, payment) {
          if(e && !payment) {
            return that.out(200, {"hasError": true, "message": "Unable to place order."}, e)
          }
          else {
            let payzaRes = PayzaPayment.getPayInfo(paymentRow.amount, 0, p.data.productName, p.data.productSku);
            notification.saveNotification(auth.credentials.id, "Your order place successfully.", (c, b) => {
              return that.out(200, {"hasError": false, "payment": {
                purchase_id: payment.purchase_id,
                timezone: payment.order_id,
                address: payment.address,
                // invoice: payment.invoice,
                name: payment.name,
                quantity: payment.quantity,
                price: payment.price,
                amount: payment.amount,
                btcAmount: payment.btc_amount,
                // redirect: (response && response.response && response.response.attributes && response.response.attributes[0] && response.response.attributes[0].value ? response.response.attributes[0].value : null)
                payza: payzaRes,
              }, "message": "Your order place successfully."}, null);
            });
          }
        });
      }
      else {
        return that.out(200, {"hasError": true, "message": "Unable to place order, Product not found."}, e)
      }
    });
  }
}

module.exports = (request, reply) => {
  let creator = new PaymentPayzaCreate(request, reply);
  return creator.processRequest();
}
