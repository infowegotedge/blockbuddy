'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class SettingsList extends ApiBaseActions {

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
    let _s       = this;
    
    return Settings.getSettings((e, r) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "settings": {
          "cutOffValue": (r && r.cut_off_value ? r.cut_off_value : null),
          "affiliationFee": (r && r.affiliation_fee ? r.affiliation_fee : null),
          "affiliationAmount": (r && r.affiliation_amount ? r.affiliation_amount : null),
          "withdrawalFee": (r && r.withdrawal_fee ? r.withdrawal_fee : null),
          "withdrawalAutoLimit": (r && r.withdrawal_auto_limit ? r.withdrawal_auto_limit : null),
          "withdrawalMinLimit": (r && r.withdrawal_min_limit ? r.withdrawal_min_limit : null),
          "withdrawalMaxLimit": (r && r.withdrawal_max_limit ? r.withdrawal_max_limit : null),
          "transferFee": (r && r.transfer_fee ? r.transfer_fee : null),
          "transferPerUserDayLimit": (r && r.transfer_per_user_day_limit ? r.transfer_per_user_day_limit : null),
          "transferCoinPerUserDayLimit": (r && r.transfer_per_user_day_limit_coin ? r.transfer_per_user_day_limit_coin : null),
          "mailChimpKey": (r && r.mail_chimp_key ? r.mail_chimp_key : null),
          "mailChimpList": (r && r.mail_chimp_list ? r.mail_chimp_list : null),
          "mailChimpEmail": (r && r.mail_chimp_email ? r.mail_chimp_email : null),
          "mailChimpFromName": (r && r.mail_chimp_from_name ? r.mail_chimp_from_name : null),
          "enableDisable": (r && r.enable_disable ? r.enable_disable : false)
        }});
      }
      else {
        return _s.out(200, {"hasError": true, "message": r});
      }
    })
  }
}

module.exports = (request, reply) => {
  let settingsList = new SettingsList(request, reply);
  return settingsList.processRequest();
}