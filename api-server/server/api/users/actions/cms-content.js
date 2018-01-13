'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class CMSContentList extends ApiBaseActions {

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
    let CMS = this.app.cms;
    let _s  = this;

    CMS.listContent((e, a) => {
      if(!e) {
        _s.out(200, {"hasError": false, "cmsContent": a})
      }
      else {
        return _s.out(200, {"hasError": true, "message": "No CMS Content has found"}, e)
      }
    });
  }
}

module.exports = (request, reply) => {
  let cmsContentList = new CMSContentList(request, reply);
  return cmsContentList.processRequest();
}