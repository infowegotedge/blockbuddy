'use strict';

/**
 * Base Class Of Logging
 */
class ApiLogger {
  
  /**
   * Constructor
   */
  constructor() {
    this.allowLog = (parseInt(process.env.ALLOW_DEBUG) === 1);
    this.logType  = process.env.DEBUG_TYPE;
  }
  
  /**
   * Log Message In Console
   * @param {String} type 
   * @param {String} message 
   */
  _log(type, message) {
    
    if(this.allowLog) {
      console.log('['+type.toUpperCase()+'] ' + (new Date()).toISOString() + ' : ', message);
    }
  }
  
  /**
   * Log Error
   * @param {Object} msgObject 
   */
  logError(msgObject) {
    
    this._log('err', msgObject);
  }
  
  /**
   * Log Information
   * @param {Object} msgObject 
   */
  logInfo(msgObject) {
    
    this._log('info', msgObject);
  }
  
  /**
   * Log Warning Message
   * @param {Object} msgObject 
   */
  logWarning(msgObject) {
    
    this._log('warn', msgObject);
  }
}

module.exports = ApiLogger