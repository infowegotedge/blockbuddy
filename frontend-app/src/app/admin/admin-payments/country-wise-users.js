'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class CountryWiseUsers extends ApiBaseActions {

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
    let Users = this.app.users;
    let _s    = this;
    
    return Users.getUsersCountryWise((e, u) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "countryUsers": u});
      }
      else {
        return _s.out(200, {"hasError": true, "message": "No Country Wise Users Found."});
      }
    });
  }
}

module.exports = (request, reply) => {
  let countryWiseUsers = new CountryWiseUsers(request, reply);
  return countryWiseUsers.processRequest();
}