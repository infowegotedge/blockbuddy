'use strict';

let ApiBaseActions = require('./../../apibase.actions');
const moment = require('moment');

class AffiliatesList extends ApiBaseActions {

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
    let Affiliates = this.app.affiliates;
    let Auth       = this.req.auth.credentials;
    let _s         = this;
    let affiliate  = {
      "status": 'Inactive',
      "startDate": '-',
      "endDate": '-',
      "active": 'N',
      "amount": this.app.ConfigSettings.affiliation_amount,
      "invoiceNo": ""
    }
    
    // Affiliates List
    Affiliates.list(Auth.id, function(e, a) {
      if(!e && a) {
        let newDate = (new Date()).getTime();
        let endDate = (a.end_date ? (new Date(a.end_date)).getTime() : null);

        affiliate.status    = a.invoice_status;
        affiliate.startDate = (a.start_date ? a.start_date : '-');
        affiliate.endDate   = (a.end_date ? a.end_date : '-');
        affiliate.active    = a.active;
        affiliate.invoiceNo = a.invoice_no

        if(endDate && endDate < newDate && a.invoice_status !== 'EXPIRED') {
          affiliate.status = 'EXPIRED';
          
          // Affiliates Update Expiry Time
          Affiliates.updateStatusExpire(Auth.id, a.invoice_no, function(e, a) {
            return _s.out(200, {"hasError": false, "affiliates": affiliate}, null);
          })
        }
        else {
          return _s.out(200, {"hasError": false, "affiliates": affiliate}, null);
        }
      }
      else {
        return _s.out(200, {"hasError": false, "affiliates": affiliate}, e);
      }
    });
  }
}

module.exports = (request, reply) => {
  let affiliatesList = new AffiliatesList(request, reply);
  return affiliatesList.processRequest();
}