'use strict';


class OrphanUsers {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // User Schmea Definition
    let userSchema = new Schema({
      name: { type: String },
      provider: { type: String },
      email: { type: String },
      displayName: { type: String },
      first_name: { type: String },
      last_name: { type: String },
      hashedPassword: { type: String },
      role: { type: String },
      mobile: { type: String },
      username: { type: String, unique: true },
      pincode: { type: String },
      state: { type: String },
      city: { type: String }, 
      address: { type: String },
      countryName: { type: String },
      sponsor: { type: String },
      userProfileId: { type: Number },
      is_found: { type: Boolean, "default": false }
    });

    // User Schema
    this.OrphanUser = connection.model('orphanusers', userSchema);
  }

  getModel() {
    return this.OrphanUser;
  }

  /**
   * 
   * @param {Object} filter 
   * @param {callback} cb 
   */
  orphanCount(filter, cb) {
    return this.OrphanUser.count(filter, cb);
  }

  /**
   * 
   * @param {Object} filter 
   * @param {Number} currentPage
   * @param {Number} perPage
   * @param {callback} cb
   */
  getOrphanUsers(filter, currentPage, perPage, cb) {
    let offset = ((currentPage - 1) * perPage);
    let query  = {"is_found": false};
    let that   = this;

    if(filter !== null) {
      let ignoreRegExp      = new RegExp(filter, 'i');
      let nonIgnoreRegExp   = new RegExp(filter);
      query["$or"] = [
        {"username": ignoreRegExp},
        {"first_name": ignoreRegExp},
        {"last_name": ignoreRegExp},
        {"email": nonIgnoreRegExp},
        {"sponsor": ignoreRegExp},
      ];
    }

    let queryObj = this.OrphanUser.find(query, 'name email displayName first_name last_name hashedPassword mobile username sponsor userProfileId is_found').sort({"_id": 1}).limit(perPage);
    if(offset !== 0) {
      queryObj = queryObj.skip(offset);
    }

    return queryObj.exec((err, users) => {
      if(!err) {
        return that.orphanCount(query, (e, count) => {
          return cb(false, {"users": users, "count": (!e && count ? count : 0)});
        });
      }
      else {
        return cb(true, 'Users not found.')
      }
    });
  }

}

module.exports = OrphanUsers;
module.exports.getName = () => {
  return 'orphanuser';
}
