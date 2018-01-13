'use strict';

var hasher = require('wordpress-hash-node');

const crypt = require('crypto');
const uuidV1 = require('uuid/v1');
const moment = require('moment');

class Users {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // User Schmea Definition
    let userSchema = new Schema({
      fname: { type: String },
      lname: { type: String },
      email: { type: String, unique: true },
      hashpass: { type: String },
      mobile: { type: String },
      username: { type: String, unique: true },
      sponsorid: { type: Object },
      sponsorname: { type: String },
      sponsorusername: { type: String },
      ip: { type: String },
      address: { type: String },
      country: { type: String },
      city: { type: String }, 
      state: { type: String },
      postal: { type: String },
      image: { type: String },
      verifed: { type: String },
      accountid: { type: String },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date },
      unix_date: { type: Number },
      verify_email: { type: Boolean },
      enable_2fa: { type: Boolean },
      enable_google: { type: Boolean },
      enable_authy: { type: Boolean },
      external_id: { type: String },
      role: { type: Array },
      is_blocked: { type: Boolean },
      provider: { type: String },
      fb_id: { type: String },
      google_id: { type: String },
      profile_updated: { type: Boolean, "default": false },
      marked_old: { type: Boolean, "default": false }
    });

    let userEmailVerifyScheme = new Schema({
      "userid": { type: Object },
      "verify_text": { type: String }
    });

    // Sponsor Link Schmea Definition
    let sponsorLink = new Schema({
      userid: { type: String },
      username: { type: String },
      actualsponsorid: { type: Object },
      sponsorid: { type: Object },
      sponsor: { type: String },
      position: { type: String },
      name: { type: String },
      email: { type: String },
      ip: { type: String },
      country: { type: String },
      mobile: { type: String },
      create_at: { type: Date }
    });

    let userreferrals = new Schema({
      uid: { type: Number },
      usersname: { type: String },
      sponsorusername: { type: String },
      username: { type: String },
      sponsor: { type: String },
      position: { type: String }
    })

    // Sponsor Position Schmea Definition
    let sponsorPosition = new Schema({
      sponsorid: { type: String },
      position: { type: String }
    });

    let roleScheme = new Schema({
      userid: { type: String },
      role: { type: String },
      category: { type: String },
      permission: { type: Array },
    });

    let userCommissionSchema = new Schema({
      userid: { type: String },
      sponsorid: { type: String },
      paid: { type: Boolean, "default": false },
      amount: { type: Number, "default": 0 },
      is_done: { type: Boolean },
      created_at: { type: Date, "default": Date.now }
    })

    // User Schema
    userSchema.index({created_at: 1, email: 1, username: 1, _id: 1}, {unique: true})
    this.User            = connection.model('User', userSchema);
    // Sponsor Schema
    this.Sponsor         = connection.model('Sponsor', sponsorLink);
    // Sponsor Position Schema
    this.SponsorPosition = connection.model('SponsorPosition', sponsorPosition);
    // Role Permission
    this.Roles           = connection.model('userrole', roleScheme);
    // User Commission Schema
    this.UserCommission  = connection.model('UserCommission', userCommissionSchema);

    this.Userreferrals   = connection.model('UserReferrals', userreferrals);

    // Verify Email Schema
    userEmailVerifyScheme.index({userid: 1, "verify_text": 1, _id: 1}, {unique: true});
    this.EmailVerify     = connection.model('VerifyEmail', userEmailVerifyScheme);
  }

  /**
   * Get Model Object
   */
  getUserModel() {
    return this.User;
  }

  /**
   * Get Sponsor Object
   */
  getSponsor() {
    return this.Sponsor;
  }

  /**
   * Get Sponsor Position Object
   */
  getSponsorPosition() {
    return this.SponsorPosition;
  }

  /**
   * Get Referral
   */
  getReferral() {
    return this.Userreferrals;
  }

  /**
   * 
   * @param {Object} filter 
   * @param {callback} cb 
   */
  listCount(filter, cb) {
    return this.User.count(filter, cb);
  }

  /**
   * 
   * @param {callback} cb 
   */
  newListCount(cb) {
    return this.User.count({"$or": [{"marked_old": false}, {"marked_old": null}]}, cb);
  }

  /**
   * 
   * @param {Object} filter 
   * @param {Number} currentPage
   * @param {Number} perPage
   * @param {callback} cb
   */
  listUsers(filter, currentPage, perPage, cb) {
    let offset = ((currentPage - 1) * perPage);
    let query  = {};
    let that   = this;

    if(filter !== null) {
      let ignoreRegExp      = new RegExp(filter, 'i');
      let nonIgnoreRegExp   = new RegExp(filter);
      query["$or"] = [
        {"username": ignoreRegExp},
        {"fname": ignoreRegExp},
        {"lname": ignoreRegExp},
        {"email": nonIgnoreRegExp},
        {"sponsorname": ignoreRegExp},
        {"sponsorusername": ignoreRegExp}
      ];
    }

    let queryObj = this.User.find(query).sort({"created_at": -1}).limit(perPage);
    if(offset !== 0) {
      queryObj = queryObj.skip(offset);
    }

    return queryObj.exec((err, users) => {
      if(!err) {
        return that.listCount(query, (e, count) => {
          return cb(false, {"users": users, "count": (!e && count ? count : 0)});
        });
      }
      else {
        return cb(true, 'Users not found.')
      }
    });
  }

  /**
   * 
   * @param {String} password 
   * @param {callback} cb
   */
  hashPassword(password) {
    // let cipher    = crypt.createCipher('aes192', process.env.AUTH_CLIENT_SECRET);
    // var encrypted = cipher.update(password, 'utf8', 'hex');
    //     encrypted += cipher.final('hex');
    
    return hasher.HashPassword(password);
  }

  /**
   * 
   * @param {String} email
   * @param {callback} cb
   */
  findByEmail(email, cb) {
    return this.User.findOne({"email": email}, '_id email fname username', function(e, u) {
      if(e || !u) {
        return cb(true, 'User not found.');
      }

      return cb(false, u);
    })
  }

  /**
   * 
   * @param {callback} cb
   */
  findAllUsers(cb) {
    let query = {};

    return this.User.find(query, '_id email fname username', function(e, u) {
      if(e || !u) {
        return cb(true, 'User not found.');
      }

      return cb(false, u);
    })
  }

  /**
   * 
   * @param {String} userId
   * @param {callback} cb
   */
  findDirectsCount(auth, email, cb) {
    let query = {"$or": [{"sponsorid": auth.id}, {"actualsponsorid": auth.id}, {"sponsor": auth.displayName}]};
    if(email) {
      query['email'] = email;
    }
    let that       = this;
    let last14Days = moment().subtract(14, 'days').toISOString();
    let last7Days  = moment().subtract(7, 'days').toISOString();

    return this.Sponsor.count(query, function(e, c) {
      query["$and"] = [{"created_at": {"$gte": last14Days}}, {"created_at": {"$lt": last7Days}}]
      return that.Sponsor.count(query, (ec, cc) => {
        query["$and"] = [{"created_at": {"$gte": last7Days}}]
        return that.Sponsor.count(query, (ecc, ccc) => {
          return cb(false, {"count": (c ? c : 0), "lastWeek": (cc ? cc : 0), "thisWeek": (ccc? ccc : 0)});
        })
      })
    });
  }

  /**
   * 
   * @param {String} userId
   * @param {Object} query
   * @param {callback} cb
   */
  findDirects(auth, query, email, cb) {
    let page     = (query.page || 1);
    let limit    = (query.limit || parseInt(process.env.PAGINATION_LIMIT));
    let offset   = (limit * (page - 1));
    let objQuery = {"$or": [{"sponsorid": auth.id}, {"actualsponsorid": auth.id}, {"sponsor": auth.displayName}]};
    if(email) {
      objQuery['email'] = email;
    }

    let directs = this.Sponsor.find(objQuery, '-_id userid name email country mobile create_at position username');
    directs.sort({"userid": 1}).limit(limit);

    if(offset !== 0) {
      directs = directs.skip(offset);
    }

    return directs.exec(cb);
  }

  /**
   * 
   * @param {Object} payload 
   * @param {Object} user
   * @param {callback} cb
   */
  changePassword(payload, user, cb) {
    let password = this.hashPassword(payload.password);
    let oldpass  = hasher.CheckPassword(payload.oldpassword, user.hashpass); // this.hashPassword(payload.oldpassword);

    if(oldpass) {
      // this.User.findOne({"username": user.username, "email": user.email, "hashpass": oldpass}, function(e, u) {
      this.User.findOne({"username": user.username, "email": user.email}, function(e, u) {
        if(e || (!e && !u)) {
          return cb(true, 'Invalid User')
        }
        else {
          if(payload.password !== payload.confirmpassword) {
            cb(true, 'Confirm password and password not match')
          }
          else {
            u.update({"hashpass":password}, cb);
          }
        }
      });
    }
    else {
      return cb(true, 'Invalid Old Password')
    }
  }
  
  /**
   * 
   * @param {Object} payload
   * @param {callback} cb
   */
  changeForgetPassword(payload, cb) {
    let that     = this;
    let password = this.hashPassword(payload.password);

    that.query(payload, function(e, u) {
      if(e || (!e && !u)) {
        return cb(true, 'Invalid Request For Password Change')
      }
      else {
        return u.update({"hashpass":password}, (e, r) => {
          if(!e) {
            return cb(false, u);
          }
          else {
            return cb(true, 'Invalid request for change password.')
          }
        });
      }
    });
  }

  /**
   * 
   * @param {String} userId 
   * @param {Object} userObj
   * @param {callback} cb
   */
  updateUserByAdmin(userId, userObj, LogData, auth, cb) {
    let that = this;
    if(userObj.password && userObj.password !== '') {
      userObj.hashpass = this.hashPassword(userObj.password);
    }

    return that.User.findOne({"_id": userId}, (e, u) => {
      if(!e && u) {
        return that.User.find({"email": {"$ne": u.email}, "username": {"$ne": u.username} ,"$or": [{"email": userObj.email}, {"username": userObj.username}]}, (e1, u1) => {
          if(!e1) {
            if(u1 && u1.length > 0) {
              return cb(true, 'User already exists for specified email or username.');
            }
            else {
              // Log Data
              LogData.createLogData(u, userObj, auth, 'USER', (el, log) => {
                return that.User.update({"_id": userId}, userObj, cb);
              });
            }
          }
          else {
            return cb(true, 'Error: Please try after sometime.')
          }
        });
      }
      else {
        return cb(true, 'User not found.')
      }
    });
  }

  /**
   * 
   * @param {String} userId 
   * @param {String} userObj
   * @param {callback} cb
   */
  updateBlocker(userId, blockUser, LogData, auth, cb) {
    let textBlockUser = 'USER BLOCK';
    if(!blockUser) {
      textBlockUser = 'USER UNBLOCK';
    }

    LogData.createLogData(userId, userId, auth, textBlockUser, (el, log) => {
      return this.User.update({"_id": userId}, {"is_blocked": blockUser}, cb)
    });
  }

  /**
   * 
   * @param {Object} payload 
   * @param {Object} auth
   * @param {callback} cb
   */
  profileUpdate(payload, auth, KYC, cb) {
    if(auth.isAuthenticated) {
      let email       = auth.credentials.email;
      let displayName = auth.credentials.displayName;
      let that        = this;
      that.User.findOne({"username": displayName}, function(e, u) {
        if(e || (!e && !u)) {
          return cb(true, 'Invalid user')
        }
        else {
          that.User.findOne({"email": payload.email, "_id": {"$ne": u._id}}, function(_e, _u) {
            if(!_e && !_u) {
              payload.updated_at = (new Date()).toISOString()
              payload.profile_updated = true;

              KYC.updateKycByUserId(u._id, {'name': payload.fname + ' ' + payload.lname, 'email': payload.email}, (ek, k) => {
                if(u.profile_updated === true) {
                  return u.update({
                    "updated_at": payload.updated_at,
                    "email": payload.email,
                    "profile_updated": true
                  }, cb);
                } 
                else {
                  return u.update(payload, cb);
                }
              });
            }
            else {
              return cb(true, 'Invalid user')
            }
          });
        }
      })
    }
    else {
      return cb(true, 'Invalid Token')
    }
  }

  /**
   * 
   * @param {String} username
   * @param {callback} cb
   */
  findSponsorUser(userName, cb) {
    this.User.findOne({"username": userName}, function(e, u) {
      if(e) {
        return cb(true, 'Sponsor user not found')
      }

      return cb(false, u);
    });
  }

  /**
   * 
   * @param {Object} newValue
   * @param {callback} cb
   */
  save(newValue, cb) {
    let uniqueId          = uuidV1();
    let newDate           = new Date();
    newValue.updated_at   = newDate.toISOString();
    newValue.unix_date    = newDate.getTime()
    newValue.verify_email = false;

    if(newValue.provider) {
      newValue.verify_email = true;
    }

    let user              = new this.User(newValue);
    user.hashpass         = this.hashPassword(newValue.password);
    let sponsorid         = {'sponsorid': newValue.username}
    let sponsorPos        = new this.SponsorPosition(sponsorid);
    let that              = this;
    
    this.User.find({"username": user.username, "email": user.email}, function(e, u) {
      if(!e && (!u || !u[0])) {
        sponsorPos.save(function(e, su) {
          return user.save(function(e, r) {
            if(!e) {
              let emailObject = {"userid": r._id, "verify_text": uuidV1()};
              let emailVerify = that.EmailVerify(emailObject);
              return emailVerify.save(function(er, ev) {
                return cb(false, {"emailVerify": emailObject.verify_text, "user": r});
              })
            }
            else {
              return cb(true, r)
            }
          });
        });
      }
      else {
        return cb(true, 'User found with this email address.');
      }
    });
  }

  /**
   * 
   * @param {String} userId 
   * @param {Object} newValue
   * @param {callback} cb
   */
  updateAddress(userId, newValue, cb) {
    return this.User.update({"_id": userId}, newValue, cb);
  }

  /**
   * 
   * @param {Object} newValue
   * @param {callback} cb
   */
  sponsor(newValue, cb) {
    if(typeof newValue.position == 'undefined') {
      this.SponsorPosition.findOne({'sponsorid': newValue.sponsorusername}, function(e, s) {
        if(!e && s !== null) {
          s.position = (s !== null && s.position == 'L' ? 'R' : 'L');
          s.save(function () {
            return cb(e, s);
          });
        }
        else if(!e && s) {
          newValue.position = 'L';
          let s = new that.SponsorPosition(newValue);
          return s.save(cb);
        }
        else {
          return cb(e, null);
        }
      });
    }
    else {
      return cb(false, 'Alredy added to '+newValue.position)
    }
  }

  /**
   * 
   * @param {Object} newValue
   * @param {callback} cb
   */
  saveSponsor(newValue, cb) {
    let that = this;
    newValue['name'] = newValue.fname.trim() + ' ' + newValue.lname.trim()
    that.User.findOne({"username": newValue.sponsorusername}, function(e, s) {
      if(!e && s) {
        newValue['sponsor']   = newValue.sponsorusername;
        newValue['sponsorid'] = s._id;
        let sponsor = new that.Sponsor(newValue);
        return sponsor.save(cb);
      }
      else {
        return cb(e, s);
      }
    });
  }

  /**
   * 
   * @param {String} userId 
   * @param {String} filePath
   * @param {callback} cb
   */
  updateImage(userId, filePath, cb) {
    let that = this;
    that.User.findOne({"_id": userId}, function(e, u) {
      if(e) {
        return cb(true, u);
      }
      return that.User.update({"_id": userId}, {"$set": {"image": filePath}}, {multi: true}, cb)
    });
  }

  /**
   * 
   * @param {Object} newValue
   * @param {callback} cb
   */
  login(newValue, cb) {
    this.User.findOne({"username": newValue.username}, function(e, u) {
      if(!e && !u) {
        return cb(true, 'Username or Password not match.');
      }
      else if(!e && u && u.is_blocked === true) {
        return cb(true, 'User is blocked by admin.')
      }
      else if(!e && u && u.verify_email === false) {
        return cb(true, 'User email verification is pending.');
      }
      else if(!e && u && hasher.CheckPassword(newValue.password, u.hashpass)) {
        // if(['bbcorp', 'johndoe', 'techsupport', 'upggr'].indexOf(u.username) != -1) {
          return cb(e, u);
        // }
        // else {
        //   return cb(true, 'Please contact BlockBuddy for this service.');
        // }
      }
      else {
        return cb(true, "Validation failed")
      }
    });
  }

  /**
   * 
   * @param {String} oldValue
   * @param {callback} cb
   */
  query(oldValue, cb) {
    return this.User.findOne({"_id": oldValue.id}, cb);
  }

  /**
   * 
   * @param {callback} cb
   */
  getLatestSignup(cb) {
    return this.User.find({}, '-_id fname lname username country').sort({"_id": -1}).limit(10).exec(cb)
  }

  /**
   * 
   * @param {callback} cb
   */
  getLatestSignupCount(cb) {
    return this.User.count({}, cb)
  }

  /**
   * 
   * @param {String} id 
   * @param {callback} cb
   */
  getUser(id, cb) {
    return this.User.findOne({"_id": id}, '-_id username email fname lname accountid enable_2fa enable_google enable_authy external_id image mobile sponsorusername', cb);
  }

  /**
   * 
   * @param {String} id 
   * @param {callback} cb
   */
  getUserForCommissionTask(id, cb) {
    return this.User.findOne({"_id": id}, '_id username sponsorid fname lname', cb);
  }

  /**
   * 
   * @param {String} username
   * @param {callback} cb
   */
  findAdminUserForLogin(username, cb) {
    return this.User.findOne({"username": username, "$or":[{"is_blocked": false}, {"is_blocked": null}], "verify_email": true}, '_id username email role fname lname sponsorid sponsorname sponsorusername enable_2fa external_id enable_google enable_authy', cb);
  }

  /**
   * 
   * @param {String} username
   * @param {callback} cb
   */
  findUserByUsername(username, cb) {
    return this.User.findOne({"username": username}, '_id username image', cb);
  }

  /**
   * 
   * @param {String} userId
   * @param {callback} cb
   */
  findUsersBySponsorIdCount(userId, cb) {
    return this.User.count({"sponsorid": userId}, cb);
  }

  /**
   * 
   * @param {String} userId
   * @param {callback} cb
   */
  findUsersBySponsorId(userId, currentPage, perPage, cb) {
    let offset = ((currentPage - 1) * perPage);
    
    let queryObj = this.User.find({"sponsorid": userId}).sort({"_id": 1}).limit(perPage);
    if(offset !== 0) {
      queryObj = queryObj.skip(offset);
    }

    this.findUsersBySponsorIdCount(userId, (e, c) => {
      return queryObj.exec((_e, u) => {
        if(!_e) {
          return cb(false, {"users": u, "totalPages": c});
        }
        else {
          return cb(true, 'Users not found.');
        }
      });
    })
  }

  /**
   * 
   * @param {String} username
   * @param {callback} cb
   */
  findNameByUsername(username, cb) {
    return this.User.findOne({"username": username}, '-_id fname lname username email', cb);
  }

  /**
   * 
   * @param {callback} cb
   */
  getCount(cb) {
    return this.User.count({}, function(e, c) {
      c = (c ? c : 0);
      if(c !== 0) {
        c = c - 1; // Company not it self counted
      }
      return cb(false, c);
    });
  }

  /**
   * 
   * @param {String} users
   * @param {callback} cb
   */
  getEmailAddressById(users, cb) {
    return this.User.find({"_id": {"$in": users}}, '-_id email', cb);
    // return this.User.find({"$or": users}, '-_id email', cb);
  }

  /**
   * 
   * @param {Number} timeLimit
   * @param {Number} limit
   * @param {callback} cb
   */
  getLast7OR30Days(timeLimit, limit, cb) {
    return this.User.aggregate([
      {"$match": {"sponsorid": {'$ne': 'bbcorp'}, "$and": [{"unix_date": {"$gte": timeLimit.min}}, {"unix_date": {"$lte": timeLimit.max}}]}},
      {"$group": {"_id": "$sponsorid", count: {"$sum": 1}}}, 
      {"$sort": {"count": -1}}, 
      {"$limit": limit}
    ], cb)
  }

  /**
   * 
   * @param {Number} limit
   * @param {callback} cb
   */
  getAllTimeLeaderBoard(limit, cb) {
    return this.User.aggregate([
      {"$match": {"sponsorid": {'$ne': 'bbcorp'}}},
      {"$group": {"_id": "$sponsorid", count: {"$sum": 1}}}, 
      {"$sort": {"count": -1}}, 
      {"$limit": limit}
    ], cb)
  }

  /**
   * 
   * @param {String} userId
   * @param {callback} cb
   */
  getUsersByIds(userIds, cb) {
    return this.User.find({"_id": {"$in": userIds}}, '_id username fname lname country image', cb);
  }

  /**
   * 
   * @param {String} userId
   * @param {callback} cb
   */
  updateUsersByIdsByAdmin(userIds, cb) {
    return this.User.update({"_id": {"$in": userIds}}, {'$set': {"marked_old": true}}, {"multi": true}, cb);
  }

  /**
   * 
   * @param {String} tokenId
   * @param {callback} cb
   */
  findUserByToken(tokenId, cb) {
    return this.EmailVerify.findOne({"verify_text": tokenId}, cb)
  }

  /**
   * 
   * @param {String} userId
   * @param {callback} cb
   */
  getSentToMessageUsers(userIds, cb) {
    return this.User.find({"username": {"$in": userIds}}, '_id fname lname email username', cb);
  }

  /**
   * 
   * @param {String} userFind
   * @param {callback} cb
   */
  findUser(userFind, cb) {
    let ignoreRegExp      = new RegExp(userFind, 'i');
    let nonIgnoreRegExp   = new RegExp(userFind);

    return this.User.find({"$or": [
      {"username": userFind}, 
      {"email": userFind}, 
      {"username": ignoreRegExp}, 
      {"email": nonIgnoreRegExp}
    ]}, '_id username fname lname email username', cb);
  }

  /**
   * 
   * @param {String} userId
   * @param {String} externalId
   * @param {String} twoFABY
   * @param {callback} cb
   */
  enable2FA(userId, externalId, twoFABy, cb) {
    let that  = this;
    let twoFA = {
      "enable_2fa": false,
      "enable_google": false,
      "enable_authy": false,
      "external_id": null
    };

    if(twoFABy.toLowerCase() === 'google') {
      twoFA["enable_2fa"]    = true;
      twoFA["enable_google"] = true;
      twoFA["external_id"]   = externalId;
    }
    else if(twoFABy.toLowerCase() === 'authy') {
      twoFA["enable_2fa"]   = true;
      twoFA["enable_authy"] = true; 
      twoFA["external_id"]  = externalId;
    }

    return that.User.update({"_id": userId}, twoFA, cb);
  }

  /**
   * 
   * @param {String} userId
   * @param {callback} cb
   */
  disable2FA(userId, cb) {
    let twoFA = {
      "enable_2fa": false,
      "enable_google": false,
      "enable_authy": false,
      "external_id": null
    };

    return this.User.update({"_id": userId}, twoFA, cb);
  }

  /**
   * 
   * @param {Object} newValue 
   * @param {callback} cb
   */
  setRoles(newValue, cb) {
    let roles = new this.Roles(newValue);
    return roles.save(cb);
  }

  /**
   * 
   * @param {String} userId 
   * @param {callback} cb
   */
  getRoles(userId, cb) {
    return this.Roles.findOne({"userid": userId}, cb);
  }

  /**
   * 
   * @param {Object} newValue 
   * @param {callback} cb
   */
  getUsersCountryWise(cb) {
    return this.User.aggregate([
      {"$group": {
        "_id": "$country",
        "total": {"$sum": 1}
      }}
    ], cb);
  }

  /**
   * 
   * @param {Object} userObj 
   * @param {callback} cb
   */
  findUserByExternalId(userObj, cb) {
    return this.User.findOne({
      "$or": [
        {'fb_id': userObj.id},
        {'google_id': userObj.id},
        {'email': userObj.email}
      ]
    }, cb);
  }

  /**
   * 
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  saveUserForCommission(newValue, cb) {
    newValue["is_done"]    = false;
    newValue["created_at"] = (new Date()).toISOString();
    let userCommission = new this.UserCommission(newValue);
    return userCommission.save(cb);
  }

  /**
   * 
   * @param {callback} cb 
   */
  tasksCommissionDistribution(cb) {
    return this.UserCommission.find({"is_done": false, "paid": true, "amount": {"$gt": 0}}).sort({"created_at": 1}).exec(cb);
  }

  /**
   * 
   * @param {callback} cb 
   */
  isUserCanGetCommission(userId, cb) {
    let date = moment().subtract(1, 'month').toISOString();
    return this.UserCommission.findOne({"userid": userId, "is_done": true, "paid": true, "amount": {"$gt": 0}, "created_at": {"$gt": date}}, cb)
  }

  /**
   * 
   * @param {String} commissionId
   * @param {callback} cb 
   */
  updateUserCommission(commissionId, cb) {
    return this.UserCommission.update({"_id": commissionId, "is_done": false}, {"is_done": true, "created_at": (new Date()).toISOString()}, cb);
  }

  /**
   * 
   * @param {Object} userId 
   * @param {Object} updateParams 
   * @param {callback} cb 
   */
  updateCommission(userId, updateParams, cb) {
    updateParams["created_at"] = (new Date()).toISOString();
    return this.UserCommission.update(userId, updateParams, cb);
  }

  findNewAffiliates(userName, cb) {
    return this.User.find({'sponsorusername': userName}, '-_id fname lname username sponsorusername created_at').sort({created_at: -1, _id: -1}).limit(4).exec(cb);
  }
}

module.exports = Users;
module.exports.getName = () => {
  return 'users';
}
