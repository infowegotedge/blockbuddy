'use strict';

let ApiBaseActions = require('./../../../apibase.actions');
let moment = require('moment');

class ListPayments extends ApiBaseActions {

  /**
   * 
   * @param {Request} request 
   * @param {Reply} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  /**
   * 
   * @param {Number} code 
   * @param {Object} data 
   */
  out(code, data) {
    return super.response(code, data);
  }

  /**
   * Process Request for Find Payments
   */
  findPayments(Payments, filter, curPage, perPage) {
    let _s = this;

    Payments.getTransactions(filter, (curPage * 1), (perPage * 1), (e, t) => {
      if(!e) {
        let len = t.payments.length;
        let paymentsList = [];

        for(let idx=0; idx < len; idx++) {
          paymentsList.push({
            "created_at": t.payments[idx].created_at,
            "fee": t.payments[idx].amount_fee,
            "amount_fee": t.payments[idx].fee_amount,
            "amount": t.payments[idx].amount,
            "status": t.payments[idx].status,
            "order_id": t.payments[idx].order_id,
            "payment_type": t.payments[idx].payment_type,
            "name": t.payments[idx].name,
            "transaction_id": t.payments[idx].transaction_id,
            "notes": t.payments[idx].notes,
            "gateway_status": t.payments[idx].gateway_status,
            "color_status": (t.payments[idx].color_status || '')
          });
        }
            
        return _s.out(200, {"hasError": false, "payments": paymentsList, "totalRows": t.count, "currentPage": curPage, "perPage": perPage});
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Transfers not found."})
      }
    });
  }

  /**
   * Process Request
   */
  processRequest() {
    let Payments = this.app.payment;
    let Users    = this.app.users;
    let query    = this.req.query;
    let curPage  = (query.page ? query.page : 1);
    let perPage  = (process.env.PAGINATION_LIMIT * 1);
    let filter   = {};
    let _s       = this;

    if(query.status) {
      filter.status = query.status;
    }

    switch (query.type) {
      case 'day':
        filter.minTime = moment().subtract(1, 'day').toISOString();
        filter.maxTime = moment().toISOString();
        break;
      case 'week':
        filter.minTime = moment().subtract(7, 'day').toISOString();
        filter.maxTime = moment().toISOString();
        break;
      case 'month':
        filter.minTime = moment().subtract(1, 'month').toISOString();
        filter.maxTime = moment().toISOString();
        break;
    }
    
    return _s.findPayments(Payments, filter, (curPage * 1), (perPage * 1));
  }
}

module.exports = (request, reply) => {
  let listPayments = new ListPayments(request, reply);
  return listPayments.processRequest();
}