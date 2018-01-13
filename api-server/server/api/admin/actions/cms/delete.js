'use strict';

let ApiBaseActions = require('./../../../apibase.actions');
const moment       = require('moment');

class DeleteCMS extends ApiBaseActions {

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
   * Process Request
   */
  processRequest() {
    let CMS     = this.app.cms;
    let payload = this.req.payload;
    let _s      = this;

    return CMS.deleteContent(payload.id, (e, a) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "message": "CMS content deleted successfully."});
      }

      return _s.out(200, {"hasError": true, "message": "No CMS content not found."});
    });
  }
}

module.exports = (request, reply) => {
  let deleteCMS = new DeleteCMS(request, reply);
  return deleteCMS.processRequest();
}