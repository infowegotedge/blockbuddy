'use strict';

const uuidV1 = require('uuid/v1');

class Validate {

  constructor(TokenValidator) {
    this.token = TokenValidator.getValidator();
  }

  // Validating Token
  verifyRequest(userId, tokenType, tokenValue, cb) {

    return this.token.update({
      userid: userId+'',
      reqtype: tokenType,
      token: tokenValue
    }, {
      "$set": {
        "reqtype": tokenType,
        "token": uuidV1()
      },
      "$inc": {"rev": 1}
    }, function(e, d) {

      if(e || !d || (d.nModified !== 1)) {

        return cb((e || true), 'Invalid Request, Required information is missing.');
      }

      return cb(false, null);
    });

  }

  // Generate New Token
  getRequestToken(userId, tokenType, cb) {

    let uniqueToken = uuidV1();
    return this.token.update({
      userid: userId+''
    }, {
      "$set": {
        "reqtype": tokenType,
        "token": uniqueToken
      },
      "$inc": {"rev": 1}
    }, {"upsert": true}, function(e, d) {

      if(e) {
        return cb(e, 'Unable to take request.');
      }

      return cb(false, uniqueToken);
    });

  }
}

module.exports = Validate;
