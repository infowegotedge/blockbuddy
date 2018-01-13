'use strict';

class TokenValidator {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // Token Validator Schmea Definition
    let tokenValidatorSchema = new Schema({
      userid: { type: String, unique: true },
      token: { type: String },
      reqtype: { type: String },
      updatedat: { type: Date, "default": Date.now },
      rev: { type: Number }
    });

    tokenValidatorSchema.index({token: 1, rev: 1, reqtype: 1}, {unique: true})
    this.Token = connection.model('TokenValidator', tokenValidatorSchema);
  }

  // Get Validator
  getValidator() {
    return this.Token;
  }
}

module.exports = TokenValidator;
module.exports.getName = () => {
  return 'tokenvalidator';
}
