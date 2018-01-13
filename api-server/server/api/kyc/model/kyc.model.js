'use strict';

const uuidV1 = require('uuid/v1');

class UserKYC {
  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // KYC User Schmea Definition
    let userMetaSchema = new Schema({
      user : {
        id: { type: String, "default": '' },
        name: { type: String, "default": '' },
        email: { type: String, lowercase: true, "default": '' },
        mobile: { type: String, "default": '' },
        govid: { type: String, "default": '' },
        taxid: { type: String, "default": '' }
      },
      kyc_flag: { type: String, "default": "UNVERIFIED" },
      moderator: {
        id: { type: String, "default": '' },
        name: { type: String, "default": '' },
        flag:  { type: String, "default": "UNVERIFIED" },
        timestamp: { type: Date, "default": Date.now },
        comments: { type: String, "default": '' },
        viewed: { type: Boolean, 'default': false },
        rejectReason: { type: String, "default": '' },
      },
      admin: {
        id: { type: String, "default": '' },
        name: { type: String, "default": '' },
        flag :  { type: String, "default": "UNVERIFIED" },
        viewed: { type: Boolean, 'default': false },
        timestamp: { type: Date, "default": Date.now },
        comments: { type: String, "default": '' },
        rejectReason: { type: String, "default": '' }
      },
      s3asset: {
        selfie: { type: String, 'default': '' },
        id_1: { type: String, 'default': '' },
        id_2: { type: String, 'default': '' },
        id_3:  { type: String, 'default': '' },
        id_4:  { type: String, 'default': '' }
      },
      doctypes: {
        selfie: { type: String, 'default': "NA" },
        id_1: { type: String, 'default': "NA" },
        id_2: { type: String, 'default': "NA" },
        id_3:  { type: String, 'default': "NA" },
        id_4:  { type: String, 'default': "NA" }
      },
      uniqueKycId: { type: Number, 'default': 0 },
      assetsStatus: {
        selfie: { type: String, 'default': '' },
        id_1: { type: String, 'default': '' },
        id_2: { type: String, 'default': '' },
        id_3:  { type: String, 'default': '' },
        id_4:  { type: String, 'default': '' }
      },
      has_multiple_ids: { type: Boolean, 'default': false },
      color_status: { type: String, 'default': '' }
    }, { timestamps: { created_at: 'created_at', updated_at: 'updated_at' } } );

    // Reject KYC Schema
    let userMetaRejectionLog = new Schema({
      usermetaid: String,
      rejectedat: { type: Date, "default": Date.now },
      rejectById: String,
      rejectByName: String,
      rejectReason: String,
      s3asset: {
        selfie: { type: String, 'default': '' },
        id_1: { type: String, 'default': '' },
        id_2: { type: String, 'default': '' },
        id_3:  { type: String, 'default': '' },
        id_4:  { type: String, 'default': '' }
      },
      doctypes: {
        selfie: { type: String },
        id_1: { type: String },
        id_2: { type: String },
        id_3:  { type: String },
        id_4:  { type: String }
      },
      assetsStatus: {
        selfie: { type: String, 'default': '' },
        id_1: { type: String, 'default': '' },
        id_2: { type: String, 'default': '' },
        id_3:  { type: String, 'default': '' },
        id_4:  { type: String, 'default': '' }
      }
    });

    this.kyc = connection.model('UserKyc', userMetaSchema);
    this.userMetaRejectionLog = connection.model('UserKycReject', userMetaRejectionLog);
  }

  /**
   * 
   * @param {Object} newKyc 
   * @param {Object} user
   * @param {callback} cb 
   */
  create(newKyc, user, userId, cb) {
    let kycData = {
      user: { 
        govid: (newKyc.governmentId || ''), 
        taxid: (newKyc.taxId || ''), 
        mobile: (user.mobile || ''), 
        email: user.email,
        name: (user.fname + ' ' + user.lname), 
        id: userId
      },
      s3asset: { 
        id_4: '', 
        id_3: '', 
        id_2: '', 
        id_1: newKyc.taxPhotoId, 
        selfie: newKyc.photoId 
      },
      assetsStatus: {
        selfie: 'UNVERIFIED',
        id_1: 'UNVERIFIED'
      },
      kyc_flag: 'UNVERIFIED'
    };

    let kyc = new this.kyc(kycData);
    kyc.save(cb);
  }

  /**
   * 
   * @param {String} userEmail
   * @param {callback} cb 
   */
  getKyc(userEmail, cb) {
    return this.kyc.findOne({"user.email": userEmail}, cb);
  }

  /**
   * 
   * @param {String} userId
   * @param {callback} cb 
   */
  getKycById(userId, cb) {
    return this.kyc.findOne({"user.id": userId}, cb);
  }

  /**
   * 
   * @param {String} userId
   * @param {Object} updateValue
   * @param {callback} cb 
   */
  updateKycByUserId(userId, updateValue, cb) {
    return this.kyc.findOne({"user.id": userId}, (e, k) => {
      if(!e && k) {
        return this.kyc.update({"user.id": userId}, {
          "user.id": userId,
          "user.name": updateValue.name,
          "user.email": updateValue.email,
          "user.mobile": k.user.mobile,
          "user.govid": k.user.govid,
          "user.taxid": k.user.taxid
        }, cb);
      }
      else {
        return cb(true, e)
      }
    });
  }

  /**
   * 
   * @param {String} userId
   * @param {callback} cb 
   */
  getKycByKycId(kycId, cb) {
    return this.kyc.findOne({"_id": kycId}, cb);
  }

  /**
   * 
   * @param {String} kycId 
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  updateKYC(kycId, newValue, cb) {
    return this.kyc.update({"_id": kycId}, newValue, cb);
  }

  /**
   * 
   * @param {String} type 
   * @param {callback} cb 
   */
  findKycCount(type, filter, cb) {
    let query = {"kyc_flag": type};
    if(filter !== null) {
      let ignoreRegExp      = new RegExp(filter, 'i');
      let nonIgnoreRegExp   = new RegExp(filter);
      query["$or"] = [
        {"user.name": ignoreRegExp},
        {"user.email": nonIgnoreRegExp},
      ];
    }

    this.kyc.count(query, function(e, r) {
      return cb(false, r);
    });
  }

  /**
   * 
   * @param {callback} cb 
   */
  newKycCount(cb) {
    let query = {"kyc_flag": "PENDING", "color_status": "N"};
    return this.kyc.count(query, cb);
  }

  /**
   * 
   * @param {String} type 
   * @param {Number} currentPage 
   * @param {Number} perPage 
   * @param {callback} cb 
   */
  findAllKyc(type, filter, currentPage, perPage, cb) {
    let page   = (currentPage || 1);
    let limit  = (perPage || parseInt(process.env.PAGINATION_LIMIT));
    let offset = (limit * (page - 1));
    let query  = {"kyc_flag": type};
    if(filter !== null) {
      let ignoreRegExp      = new RegExp(filter, 'i');
      let nonIgnoreRegExp   = new RegExp(filter);
      query["$or"] = [
        {"user.name": ignoreRegExp},
        {"user.email": nonIgnoreRegExp},
      ];
    }

    let kyc = this.kyc.find(query);
    kyc     = kyc.sort({'_id': -1}).limit(limit);

    if(offset !== 0) {
      kyc = kyc.skip(offset);
    }
    
    kyc.exec(function(e, c) {
      if(!e) {
        return cb(false, c)
      }
      else {
        return cb(true, e);
      }
    });
  }

  /**
   * Is user KYC
   */
  isUserKycVerified(userId, cb) {
    this.kyc.findOne({"user.id": userId}, function(e, r) {
      if (
        (this.kyc_flag == 'APPROVED') && 
        (this.moderator.viewed == true) && 
        (this.moderator.flag == 'APPROVED') && 
        (this.admin.viewed == true) && 
        (this.admin.flag == 'APPROVED')
      ) {
        //Check if its verified by admin and Moderator
        return cb(false, true);
      }
      else {
        return cb(true, false);
      }
    });
  }
}

module.exports = UserKYC;
module.exports.getName = () => {
  return 'kyc';
}
