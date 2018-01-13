'use strict';

class Rates {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // Rates Schema Definition
    let ratesSchema = new Schema({
      rates: { type: Number },
      low_rates: { type: Number },
      high_rates: { type: Number },
      currency: { type: String },
      active: { type: String }
    });

    ratesSchema.index({active: 1, _id: 1}, {unique: true});
    this.Rate = connection.model('Rate', ratesSchema);
  }

  updateRates(cb) {
    return this.Rate.update({'active': 'Y'}, {'active': 'N'}, cb);
  }

  saveRates(newValue, cb) {
    let rateObj = new this.Rate(newValue);
    return rateObj.save(cb);
  }

  getRates(cb) {
    return this.Rate.findOne({'active': 'N'}, '-_id rates', cb);
  }
}

module.exports = Rates;
module.exports.getName = () => {
  return 'rates';
}