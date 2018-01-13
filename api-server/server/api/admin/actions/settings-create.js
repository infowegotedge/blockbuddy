'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class SettingsCreate extends ApiBaseActions {

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
    let Settings = this.app.settings;
    let payload  = this.req.payload;
    let _s       = this;

    if(!payload.cutOffValue && !payload.affiliationFee && !payload.affiliationAmount && !payload.withdrawalFee && !payload.withdrawalAutoLimit && !payload.withdrawalMinLimit && !payload.withdrawalMaxLimit && !payload.transferFee && !payload.transferPerUserDayLimit && !payload.transferCoinPerUserDayLimit) {
      return _s.out(200, {"hasError": true, "message": "You have not enter any value."})
    }
    
    return Settings.createSettings(payload, (e, r) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "message": "Setting is saved successfully."});
      }
      else {
        return _s.out(200, {"hasError": true, "message": r});
      }
    })
  }
}

module.exports = (request, reply) => {
  let settingsCreate = new SettingsCreate(request, reply);
  return settingsCreate.processRequest();
}