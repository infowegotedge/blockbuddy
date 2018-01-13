'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class KYCList extends ApiBaseActions {

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
    let auth    = this.req.auth;
    let query   = this.req.query;
    let kyc     = this.app.kyc;
    let _s      = this;
    let curPage = (query.page ? query.page : 1);
    let perPage = parseInt(process.env.PAGINATION_LIMIT);
    let filter  = null;

    if(query.filter) {
      filter = query.filter;
    }

    // Find KYC Count
    kyc.findKycCount(query.type.toUpperCase(), filter, function(_e, kycCount) {
      // Find KYC
      kyc.findAllKyc(query.type.toUpperCase(), filter, curPage, perPage, function(e, kyc) {
        if(!e) {
          return _s.out(200, {"hasError": false, "kyc": kyc, "totalRows": kycCount, "currentPage": curPage, "perPage": perPage}, null);
        }
        else {
          return _s.out(200, {"hasError": true, "message": c}, e)
        }
      });
    });
  }
}

module.exports = (request, reply) => {
  let kycList = new KYCList(request, reply);
  return kycList.processRequest();
}
