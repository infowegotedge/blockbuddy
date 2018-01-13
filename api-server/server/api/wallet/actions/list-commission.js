'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class ListDrawCommission extends ApiBaseActions {

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
    let Ledger  = this.app.ledger;
    let auth    = this.req.auth.credentials;
    let _s      = this;
    let perPage = 10;

    Ledger.referralList(auth.id, perPage, (e, ledger) => {
      if(!e && ledger && ledger.length > 0) {
        let length = ledger.length;
        let lists  = [];

        for(let idx=0; idx<length; idx++) {
          lists.push({
            "description": ledger[idx].description,
            "username": ledger[idx].object_name,
            "amount": ledger[idx].total_amount,
            "status": ledger[idx].status,
            "created_at": ledger[idx].created_at
          });
        }

        return _s.out(200, {"hasError": false, "commissions": lists}, null)
      }
      else {
        return _s.out(200, {"hasError": true, "message": "No transactions found."}, e)
      }
    });
  }
}

module.exports = (request, reply) => {
  let listDrawCommission = new ListDrawCommission(request, reply);
  return listDrawCommission.processRequest();
}