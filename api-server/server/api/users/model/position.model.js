'use strict';

// const crypt = require('crypto')

class Positions {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // Position Schema Definition
    let positionSchema = new Schema({
      "userid": { type: Object },
      "position": { type: String }
    });

    // Position Schema
    this.Positions = connection.model('UserPosition', positionSchema);
  }

  /**
   * 
   * @param {String} userId 
   * @param {callback} cb 
   */
  getPositions(userId, cb) {
    return this.Positions.findOne({"userid": userId+''}, cb);
  }

  /**
   * 
   * @param {String} userId 
   * @param {String} positionLR
   * @param {callback} cb 
   */
  createPositions(userId, positionLR, cb) {
    let that = this;
    this.getPositions(userId, function(e, r) {
      if(!e && !r) {
        if(positionLR.toUpperCase() === 'BOTH') {
          positionLR = null;
        }

        let position = new that.Positions({"userid": userId, "position": positionLR});
        position.save(cb);
      }
      else {
        return cb(true, 'Unable to create position.');
      }
    });
  }

  /**
   * 
   * @param {String} userId 
   * @param {String} positionLR
   * @param {callback} cb 
   */
  updatePositions(userId, positionLR, cb) {
    let that = this;

    that.getPositions(userId, function(e, p) {
      if(!e && p) {
        if(positionLR.toUpperCase() === 'BOTH') {
          positionLR = null;
        }

        return p.update({"position": positionLR}, cb)
      }
      else {
        return that.createPositions(userId, positionLR, cb);
      }
    });
  }
}

module.exports = Positions;
module.exports.getName = () => {
  return 'position';
}