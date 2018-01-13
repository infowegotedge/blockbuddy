'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class WalletList extends ApiBaseActions {

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
    let query   = this.req.query;
    let _s      = this;
    let curPage = (query.page ? (query.page * 1) : 1);
    let perPage = parseInt(process.env.PAGINATION_LIMIT);

    Ledger.listLedger(auth.id, curPage, perPage, function(e, ledger) {
      let _ledger = ledger.rows, count = ledger.count;
      
      if(!e && _ledger && _ledger.length > 0) {
        let length = _ledger.length;
        let lists  = [];

        for(let idx=0; idx<length; idx++) {
          lists.push({
            "description": _ledger[idx].description,
            "subDescription": (_ledger[idx].description.match(/Transfer/) ? null : _ledger[idx].account_id),
            "amount": _ledger[idx].total_amount,
            "status": _ledger[idx].status,
            "created_at": _ledger[idx].created_at
          });
        }

        return _s.out(200, {"hasError": false, "transactions": lists, "totalRows": count, "currentPage": curPage, "perPage": perPage}, null)
      }
      else {
        return _s.out(200, {"hasError": true, "message": "No transactions found."}, e)
      }
    });
  }
}

module.exports = (request, reply) => {
  let walletList = new WalletList(request, reply);
  return walletList.processRequest();
}