'use strict';

// const crypt = require('crypto')

class SettingsModel {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // Settings Schema Definition
    let settingsSchema = new Schema({
      cut_off_value: { type: Number },
      affiliation_fee: { type: Number },
      affiliation_amount: { type: Number },
      withdrawal_fee: { type: Number },
      withdrawal_auto_limit: { type: Number },
      withdrawal_min_limit: { type: Number },
      withdrawal_max_limit: { type: Number },
      transfer_fee: { type: Number },
      transfer_per_user_day_limit: { type: Number },
      transfer_per_user_day_limit_coin: { type: Number },
      mail_chimp_key: { type: String },
      mail_chimp_list: { type: String },
      mail_chimp_email: { type: String },
      mail_chimp_from_name: { type: String },
      created_at: { type: Date, "default": Date.now },
      updated_at: { type: Date },
      active: { type: Boolean },
      enable_disable: { type: Boolean }
    });

    // Settings Schema
    settingsSchema.index({active:1, cut_off_value:1, affiliation_fee:1, affiliation_amount:1, withdrawal_fee:1, transfer_fee:1, withdrawal_auto_limit:1, withdrawal_min_limit:1, withdrawal_max_limit:1, transfer_per_user_day_limit: 1, transfer_per_user_day_limit_coin: 1})
    this.Settings = connection.model('Setting', settingsSchema);
  }

  // Get Settings
  getSettings(cb) {
    return this.Settings.findOne({"active": true}, '-_id cut_off_value affiliation_fee affiliation_amount withdrawal_fee withdrawal_auto_limit withdrawal_min_limit withdrawal_max_limit transfer_fee transfer_per_user_day_limit transfer_per_user_day_limit_coin mail_chimp_key mail_chimp_list mail_chimp_email mail_chimp_from_name enable_disable', cb)
  }

  // Get Settings Inactive
  settingInactive(cb) {
    let newDate = (new Date()).toISOString();
    return this.Settings.findOneAndUpdate({"active": true}, {"$set": {"updated_at": newDate, "active": false}}, {"upsert": false}, cb);
  }

  // Create Settings
  createSettings(newValue, cb) {
    let that = this;

    // Get Settings
    return that.getSettings((e, r1) => {
      // Inactive Settings
      return that.settingInactive((e, r) => {
        if(!e) {
          let settingData = {
            "cut_off_value": (newValue.cutOffValue ? newValue.cutOffValue : (r && r.cut_off_value ? r.cut_off_value : null)),
            "affiliation_fee": (newValue.affiliationFee ? newValue.affiliationFee : (r && r.affiliation_fee ? r.affiliation_fee : null)),
            "affiliation_amount": (newValue.affiliationAmount ? newValue.affiliationAmount : (r && r.affiliation_amount ? r.affiliation_amount : null)),
            "withdrawal_fee": (newValue.withdrawalFee ? newValue.withdrawalFee : (r && r.withdrawal_fee ? r.withdrawal_fee : null)),
            "withdrawal_auto_limit": (newValue.withdrawalAutoLimit ? newValue.withdrawalAutoLimit : (r && r.withdrawal_auto_limit ? r.withdrawal_auto_limit : null)),
            "withdrawal_min_limit": (newValue.withdrawalMinLimit ? newValue.withdrawalMinLimit : (r && r.withdrawal_min_limit ? r.withdrawal_min_limit : null)),
            "withdrawal_max_limit": (newValue.withdrawalMaxLimit ? newValue.withdrawalMaxLimit : (r && r.withdrawal_max_limit ? r.withdrawal_max_limit : null)),
            "transfer_fee": (newValue.transferFee ? newValue.transferFee : (r && r.transfer_fee ? r.transfer_fee : null)),
            "transfer_per_user_day_limit": (newValue.transferPerUserDayLimit ? newValue.transferPerUserDayLimit : (r && r.transfer_per_user_day_limit ? r.transfer_per_user_day_limit : null)),
            "transfer_per_user_day_limit_coin": (newValue.transferCoinPerUserDayLimit ? newValue.transferCoinPerUserDayLimit : (r && r.transfer_per_user_day_limit_coin ? r.transfer_per_user_day_limit_coin : null)),
            "mail_chimp_key": (newValue.mailChimpKey ? newValue.mailChimpKey : (r && r.mail_chimp_key ? r.mail_chimp_key : null)),
            "mail_chimp_list": (newValue.mailChimpList ? newValue.mailChimpList : (r && r.mail_chimp_list ? r.mail_chimp_list : null)),
            "mail_chimp_email": (newValue.mailChimpEmail ? newValue.mailChimpEmail : (r && r.mail_chimp_email ? r.mail_chimp_email : null)),
            "mail_chimp_from_name": (newValue.mailChimpFromName ? newValue.mailChimpFromName : (r && r.mail_chimp_from_name ? r.mail_chimp_from_name : null)),
            "updated_at": (new Date()).toISOString(),
            "active": true,
            "enable_disable": ((r1 && r1.enable_disable === true) ? false : ((r1 && r1.enable_disable === false) ? true : true))
          };
          
          // Create Settings
          let settings = new this.Settings(settingData);
          return settings.save(cb);
        }
        else {
          return cb(true, 'Unable to obtain lock, request is cancelled.');
        }
      });
    });
  }
}

module.exports = SettingsModel;
module.exports.getName = () => {
  return 'settings';
}