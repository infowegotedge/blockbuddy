'use strict';

// const crypt = require('crypto')
let moment = require('moment');

class AffiliatesCount {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // Affiliates Counts Schema Definition
    let affiliatesCountSchema = new Schema({
      "userid": { type: Object },
      "username": { type: String },
      "visit": { type: Number, "default": 0 },
      "signup": { type: Number, "default": 0 },
      "created_at": { type: Date, "default": Date.now }
    });

    // Affiliates Count Schema
    this.AffiliatesCount = connection.model('AffiliatesCount', affiliatesCountSchema);
  }

  /**
   * 
   * @param {String} userId 
   * @param {callback} cb 
   */
  findCount(userId, username, cb) {
    return this.AffiliatesCount.findOne({"$or": [{"userid": userId+''}, {"username": username}]}, cb)
  }

  /**
   * 
   * @param {String} userId 
   * @param {callback} cb 
   */
  findCounts(userId, cb) {
    let last14Days = moment().subtract(14, 'days').toISOString();
    let last7Days = moment().subtract(7, 'days').toISOString();

    return this.AffiliatesCount.count({"userid": userId+'', "visit": {"$ne": 0}}, (e, c) => {
      return this.AffiliatesCount.count({"userid": userId+'', "visit": {"$ne": 0}, "$and": [{"created_at": {"$gt": last14Days}}, {"created_at": {"$lt": last7Days}}]}, (ec, cc) => {
        return this.AffiliatesCount.count({"userid": userId+'', "visit": {"$ne": 0}, "created_at": {"$gte": last7Days}}, (ecc, ccc) => {
          return cb(false, {
            "count": (c ? c : 0),
            "last14Days": (cc ? cc : 0),
            "last7Days": (ccc ? ccc : 0),
          });
        })
      })
    })
  }

  /**
   * 
   * @param {String} userId 
   * @param {callback} cb 
   */
  findSignups(userId, cb) {
    let last14Days = moment().subtract(14, 'days').toISOString();
    let last7Days = moment().subtract(7, 'days').toISOString();

    return this.AffiliatesCount.count({"userid": userId+'', "signup": {"$ne": 0}}, (e, c) => {
      return this.AffiliatesCount.count({"userid": userId+'', "signup": {"$ne": 0}, "$and": [{"created_at": {"$gt": last14Days}}, {"created_at": {"$lt": last7Days}}]}, (ec, cc) => {
        return this.AffiliatesCount.count({"userid": userId+'', "signup": {"$ne": 0}, "created_at": {"$gte": last7Days}}, (ecc, ccc) => {
          return cb(false, {
            "count": (c ? c : 0),
            "last14Days": (cc ? cc : 0),
            "last7Days": (ccc ? ccc : 0),
          });
        })
      })
    })
  }

  _filterById(id, user) {
    return user.filter((el) =>
      el._id+'' === id+''
    );
  }

  /**
   * 
   * @param {String} userId 
   * @param {callback} cb 
   */
  findAffiliates(Users, imageUri, cb) {
    let that = this;
    this.AffiliatesCount.aggregate([
      {"$match": {"visit": {"$gt": 0}, "signup": 0}},
      {"$group": {"_id": {"userid": "$userid", "username": "$username"}, "totalCount": {"$sum": 1}}},
      {"$sort": {"totalCount": -1}},
      {"$limit": 4}
    ], (e, a) => {

      if(!e) {
        let affLength = a.length;
        let affUsers  = [];
        for(let idx = 0; idx < affLength; idx++) {
          affUsers.push(a[idx]._id.userid + '');
        }

        that.AffiliatesCount.aggregate([
          {"$match": {"userid": {"$in": affUsers}, "visit": 0, "signup": {"$gt": 0}}},
          {"$group": {"_id": "$userid", "totalCount": {"$sum": 1}}},
          {"$limit": 4}
        ], (_e, _a) => {

          return Users.getUsersByIds(affUsers, (e, u) => {
            if(!e && u) {
              let affUsers  = [];
              for(let idx = 0; idx < affLength; idx++) {
                let _user   = this._filterById(a[idx]._id.userid, u);
                let _signup = this._filterById(a[idx]._id.userid, (!_e && _a ? _a : []))

                affUsers.push({
                  username: a[idx]._id.username,
                  fullName: (_user[0] ? (_user[0].fname + '' + _user[0].lname) : ''),
                  image: (_user[0] && _user[0].image ? ((!_user[0].image.indexOf('http') || !_user[0].image.indexOf('https')) ? _user[0].image : imageUri+_user[0].image) : ''),
                  visit: a[idx].totalCount,
                  signup: ((_signup && _signup.length > 0) ? _signup[0].totalCount : 0)
                });
              }

              return cb(false, affUsers);
            }
            else {
              return cb(true, "No Data Found");    
            }
          })

        })
      }
      else {
        return cb(true, "No Data Found");
      }
    });


    // return this.AffiliatesCount.find({}).sort({"visit": -1, "signup": -1}).limit(4).exec((e, a) => {
    //   if(!e) {
    //     let affLength = a.length;
    //     let affUsers  = [];
    //     for(let idx = 0; idx < affLength; idx++) {
    //       affUsers.push(a[idx].userid + '');
    //     }

    //     return Users.getUsersByIds(affUsers, (e, u) => {
    //       if(!e && u) {
    //         let affUsers  = [];
    //         for(let idx = 0; idx < affLength; idx++) {
    //           let _user = this._filterById(a[idx].userid, u);
    //           affUsers.push({
    //             username: a[idx].username,
    //             fullName: (_user[0] ? (_user[0].fname + '' + _user[0].lname) : ''),
    //             image: (_user[0] && _user[0].image ? (imageUri + _user[0].image): ''),
    //             visit: a[idx].visit,
    //             signup: a[idx].signup
    //           });
    //         }

    //         return cb(false, affUsers);
    //       }
    //       else {
    //         return cb(true, "No Data Found");    
    //       }
    //     })
    //   }
    //   else {
    //     return cb(true, "No Data Found");
    //   }
    // });
  }

  /**
   * 
   * @param {String} userId
   * @param {String} username 
   * @param {callback} cb 
   */
  updateVisitCount(userId, username, cb) {
    let that = this;
    let affiliate = that.AffiliatesCount({
      "userid": userId+'',
      "username": username,
      "visit": 1,
      "signup": 0,
      "created_at": (new Date()).toISOString()
    });

    return affiliate.save(cb);

    // that.AffiliatesCount.findOneAndUpdate(
    //   {"userid": userId, "username": username}, 
    //   {"$inc": {"visit": 1}}, 
    //   {"upsert": true, returnNewDocument : true}, 
    //   (e, p) => {
    //     if(!e) {
    //       return cb(false, 1);
    //     }
    //     else {
    //       return cb(true, 0);
    //     }
    // });
  }

  /**
   * 
   * @param {String} userId 
   * @param {String} username
   * @param {callback} cb 
   */
  updateSignupCount(userId, username, cb) {
    let that = this;
    let affiliate = that.AffiliatesCount({
      "userid": userId + '',
      "username": username,
      "visit": 0,
      "signup": 1,
      "created_at": (new Date()).toISOString()
    });

    return affiliate.save(cb);

    // that.AffiliatesCount.findOneAndUpdate(
    //   {"userid": userId, "username": username}, 
    //   {"$inc": {"signup": 1}}, 
    //   {"upsert": true, returnNewDocument : true}, 
    //   (e, p) => {
    //     if(!e) {
    //       return cb(false, 1);
    //     }
    //     else {
    //       return cb(true, 0);
    //     }
    // });
  }
}

module.exports = AffiliatesCount;
module.exports.getName = () => {
  return 'AffiliatesCount';
}