'use strict';

const crypt = require('crypto')

class VerifyToken {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // Token Schema Definition
    let tokenSchema = new Schema({
      userid: {type: Object},
      token: {type: String},
      validtoken: {type: String},
      exptime: {type: Number}
    });

    // Token Schema
    tokenSchema.index({token: 1}, {unique: true})
    this.ValidateToken = connection.model('VerifyToken', tokenSchema);
  }

  /**
   * Find Valued By Token Id
   * @param {String} tokenId 
   * @param {callback} cb 
   */
  findValuesTokenById(tokenId, cb) {
    return this.ValidateToken.findOne({"_id": tokenId}, function(e, c) {
      if(e) {
        return cb(true, '');
      }
      else {
        return cb(false, c);
      }
    });
  }

  /**
   * Find Value By ValidToken
   * @param {String} validTokenId 
   * @param {callback} cb 
   */
  updateToken(validTokenId, insertToken, tokenExp, cb) {
    let that = this;

    return that.ValidateToken.findOne({"validtoken": validTokenId}, function(e, c) {
      if(e || !c) {
        return cb(true, null);
      }
      else {

        return c.remove((_e, _c) => {

          if(!e) {
            return that.insertToken(insertToken, tokenExp, cb);
          }
          else {
            return cb(true, null);
          }

        });
      }
    });
  }

  /**
   * Find Valued By Token Id
   * @param {String} tokenId 
   * @param {callback} cb 
   */
  findTokenById(tokenId, cb) {
    return this.ValidateToken.findOne({"_id": tokenId}, function(e, c) {
      if(e) {
        return cb(true, '');
      }
      else {
        return cb(false, c.token);
      }
    });
  }

  /**
   * Find Valued By Token Id and Expiry Time
   * @param {String} tokenId 
   * @param {callback} cb 
   */
  findByToken(token, cb) {
    let newTime = new Date().getTime();
    return this.ValidateToken.findOne({"token": token, "exptime": {"$gt": newTime}}, function(e, c) {
      return cb(false, (c ? c.validtoken : 0));
    });
  }

  /**
   * Insert Token Id
   * @param {Object} tokenObj 
   * @param {Date} tokenExp
   * @param {callback} cb 
   */
  insertToken(tokenObj, tokenExp, cb) {
    let that     = this;
    let newTime  = new Date().getTime();
    let _newTime = newTime + (parseInt(tokenExp) * 1000);

    tokenObj.exptime    = _newTime;
    tokenObj.validtoken = tokenObj.token;
    tokenObj.token      = tokenObj.token.substring((tokenObj.token.length - 64));

    return that.ValidateToken.findOne({"userid": tokenObj.userid, "exptime": {"$gt": newTime}}, function(e, c) {
      console.log(e, c);
      if(e) {
        return cb(true, e)
      }
      else if(!c || c.length === 0) {
        let insertToken = new that.ValidateToken(tokenObj);
        return insertToken.save(cb);
      }
      else {
        return cb(false, c);
      }
    });
  }

  /**
   * Delete Token
   * @param {String} token
   * @param {callback} cb 
   */
  deleteToken(token, cb) {
    let that = this;

    return that.ValidateToken.findOne({"validtoken": token}, function(e, dt) {
      if(!e) {
        return that.ValidateToken.remove({"userid": dt.userid}, cb);
      }
      else {
        return cb(true, "Unable to logout.")
      }
    })
  }
}

module.exports = VerifyToken;
module.exports.getName = () => {
  return 'verifytoken';
}