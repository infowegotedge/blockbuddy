'use strict';

let ApiBaseActions = require('./../../../apibase.actions');
const moment       = require('moment');

class UpdateCMS extends ApiBaseActions {

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

    return CMS.updateContent(payload.id, payload, (e, a) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "message": "CMS content updated successfully."});
      }

      return _s.out(200, {"hasError": true, "message": "CMS content not updated."});
    });
  }
}

module.exports = (request, reply) => {
  let updateCMS = new UpdateCMS(request, reply);
  return updateCMS.processRequest();
}