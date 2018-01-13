'use strict';

let ApiLogger = require('./apilogger');

/**
 * Base Class of ALL Classes
 */
class ApiBaseActions {

  /**
   * Constructor 
   * @param {Request} request 
   * @param {Reply} reply 
   */
  constructor(request, reply) {
    this.request   = request;
    this.response  = reply;
    this.apiLogger = new ApiLogger();
  }

  /**
   * Get Request Body
   */
  get requestBody() {
    return this.request.payload;
  }

  /**
   * Get Request Params
   */
  get requestParams() {
    return this.request.params;
  }

  /**
   * Get Request Query
   */
  get requestQuery() {
    return this.request.query;
  }

  /**
   * Is Authenticated User
   */
  get isAuthenticated() {
    let _r = this.request;
    return (_r.auth && (_r.auth.isAuthenticated === true));
  }

  /**
   * Auth Object
   */
  get authObject() {
    return this.request.auth;
  }
  
  /**
   * Get Logger Class Object
   */
  get logger() {
    return this.apiLogger;
  }

  /**
   * Filter By ID
   * @param {Object} obj 
   * @param {String} id 
   */
  filterById(obj, id) {
    return obj.filter((el) =>
      el._id+'' === id+''
    );
  }

  /**
   * 
   * @param {String} cookieName 
   * @param {String} cookieValue 
   */
  responseCookie(cookieName, cookieValue) {
    
    this.response.state(cookieName, cookieValue);
  }
  
  /**
   * 
   * @param {Number} statusCode 
   * @param {Object} responseBody 
   * @param {Option} cookie 
   */
  response(statusCode, responseBody, cookie = null) {
    if(cookie != null) {
      return this.response(responseBody).state(cookie.name, cookie.value).code(statusCode);
    }

    return this.response(responseBody).code(statusCode);
  }

  /**
   * 
   * @param {String} uri 
   */
  tempRedirect(uri) {
    return this.response.redirect(uri).code(302);
  }
}

module.exports = ApiBaseActions;
