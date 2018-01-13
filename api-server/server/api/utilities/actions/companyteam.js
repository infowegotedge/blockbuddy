'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class CompanyTeam extends ApiBaseActions {

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
   */
  out(code, data) {
    return super.response(code, data);
  }

  /**
   * Process Request
   */
  processRequest() {
    let Purchase = this.app.purchase;
    let Users    = this.app.users;
    let auth     = this.req.auth;
    let _s       = this;

    Users.getCount(function(e, c) {
      return _s.out(200, {"hasError": false, "totalTeam": c});
    })
  }
}

module.exports = (request, reply) => {
  let companyTeam = new CompanyTeam(request, reply);
  return companyTeam.processRequest();
}