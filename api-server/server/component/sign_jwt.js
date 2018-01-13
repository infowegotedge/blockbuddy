'use strict';

const jwt     = require('jsonwebtoken');
const crypto  = require('crypto');

/**
 * SignIN JWT Token Class
 */
class SignJWT {

  constructor() {
    this._cert = new Buffer(process.env.AUTH_CLIENT_SECRET, 'base64')
  }

  /**
   * Encode Values
   * @param {Object} encodeObj 
   */
  encode(encodeObj) {
    let _jwtSign = jwt.sign(encodeObj, this._cert, {
      algorithm: process.env.TOKEN_ALGORITHS,
      audience: process.env.AUTH_CLIENT_AUDIENCE,
      expiresIn:  parseInt(process.env.TOKEN_EXPIRES || 1800)
    });

    let cipher = crypto.createCipher(process.env.TOKEN_CRYPTO_HASH, process.env.TOKEN_CRYPTO_STRING);
    _jwtSign   = cipher.update(_jwtSign, 'utf8', 'hex');
    _jwtSign  += cipher.final('hex');

    return _jwtSign;
  }

  /**
   * Decode Values
   * @param {String} decodeStr
   * @param {Request} request 
   */
  decode(decodeStr, request) {
    let decipher  = crypto.createDecipher(process.env.TOKEN_CRYPTO_HASH, process.env.TOKEN_CRYPTO_STRING);
    let decrypted = decipher.update(decodeStr, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

    if(decrypted.split('.').length !== 3)
    {
      return false;
    }
    
    request.auth.token = decrypted;
    return decrypted;
  }

  /**
   * Get Certificates
   */
  certificate() {
    return this._cert;
  }

  /**
   * Get Validate Options
   */
  validateOptions() {
    return {
      algorithms: process.env.TOKEN_ALGORITHS.split(','),
      audience: process.env.AUTH_CLIENT_AUDIENCE
    };
  }
}

module.exports = new SignJWT();