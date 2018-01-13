'use strict';

let ApiBaseActions = require('./../../apibase.actions');
let Neo4JDB        = require('./../../../component/neo4j_db');

class MyUniLevelNetwork extends ApiBaseActions {

  /**
   * Constructor
   * @param {Request} request 
   * @param {Replay} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  /**
   * Generate Output
   * @param {Number} code 
   * @param {Object} data 
   * @param {Error} error 
   */
  out(code, data, error) {
    if(error) {
      super.logger.logError(error);
    }

    if(data.hasError) {
      super.logger.logWarning(data.message);
    }

    return super.response(code, data);
  }

  /**
   * 
   * @param {Object} obj 
   * @param {String} id 
   */
  neo4JFilterById(obj) {
    if(obj.records && obj.records.length) {
      let neo4JObject = {};

      for(let rec in obj.records) {
        neo4JObject[obj.records[rec].get('member_id')] = obj.records[rec].get('member_count').low;
      }

      return neo4JObject;
    }
    else {
      return [];
    }
  }

  /**
   * Process Request
   */
  processRequest() {
    let auth     = this.req.auth.credentials;
    let query    = this.req.query;
    let Users    = this.app.users;
    let that     = this;
    let userList = [];
    let parent   = {};
    let curPage  = (query.page ? (query.page * 1) : 1);
    let perPage  = (process.env.PAGINATION_LIMIT * 1);

    // Find User By UserName
    Users.findUserByUsername((query.username || auth.displayName), function(e, u1) {
      if(!e && u1) {

        Users.findUsersBySponsorId(u1._id, curPage, perPage, (e, u) => {
          if(!e && u && u.users && u.users.length > 0) {
            let users = u.users.length;
            let neo4JIds = '';
            let parent = {
              "sponsorUsername": auth.sponsorUsername,
              "country": '',
              "joinat": '',
              "name": auth.name,
              "username": auth.displayName,
              "image": (u1 && u1.image ? (u1.image.indexOf('http') === -1 ? process.env.AWS_PATH + u1.image : u1.image) : null),
              "count": 0
            };

            for(let idx=0; idx<users; idx++) {
              neo4JIds = neo4JIds + (neo4JIds ? ',"' : '"') + u.users[idx]._id + '"';
            }

            Neo4JDB.memberUniLevelCount(neo4JIds, (_e, nid) => {
              let nusers = that.neo4JFilterById(nid);

              for(let idx=0; idx<users; idx++) {
                let uprop = u.users[idx];

                userList.push({
                  "sponsorUsername": uprop.sponsorusername,
                  "country": uprop.country,
                  "joinat": uprop.created_at,
                  "name": uprop.fname + ' ' + uprop.lname,
                  "username": (uprop.username ? uprop.username : ''),
                  "image": (uprop && uprop.image ? (uprop.image.indexOf('http') === -1 ? process.env.AWS_PATH + uprop.image : uprop.image) : null),
                  "count": (nusers[uprop._id+''] ? nusers[uprop._id+''] : 0)
                });
              }

              return that.out(200, {'hasError': false, 'parent': parent, 'users': userList, 'totalPages': u.totalPages, 'currentPage': curPage}, null);
            })
          }
          else {
            return that.out(200, {'hasError': true, 'message': 'Users not found.'}, e);
          }
        })

        // // Find User By Team In Neo4J
        // Neo4JDB.myUniLevelTeam(auth.id, u._id, auth.scope[0], function(e, u) {
        //   if(!e && u) {
        //     let users = u.records.length;
        //     let userImage = [];
        //     let neo4JIds  = '';
        //     if(users !== 0) {
        //       for(let idx=0; idx<users; idx++) {
        //         let uprop = u.records[idx].get('n')['properties'];
        //         let upgop = u.records[idx].get('hs')['properties'];
        //         userImage.push(upgop.id);
        //         userImage.push(uprop.id);
        //         neo4JIds = neo4JIds + (neo4JIds ? ',"' : '"') + uprop.id + '"';
        //       }

        //       Neo4JDB.memberUniLevelCount(neo4JIds, (_e, nid) => {
        //         let nusers = that.neo4JFilterById(nid);

        //         Users.getUsersByIds(userImage, (e, ui) => {
        //           for(let idx=0; idx<users; idx++) {
        //             let uprop  = u.records[idx].get('n')['properties'];
        //             let upgop  = u.records[idx].get('hs')['properties'];
        //             let user1  = that.filterById(ui, uprop.id);
        //             let user2  = that.filterById(ui, upgop.id);

        //             if (idx === 0) {
        //               parent = {
        //                 "sponsorUsername": upgop.sponsor,
        //                 "country": upgop.country,
        //                 "joinat": upgop.joinat,
        //                 "name": upgop.name,
        //                 "username": (upgop.username ? upgop.username : ''),
        //                 "position": upgop.position,
        //                 "sponsorStr": upgop.id,
        //                 "sponsorMatchStr": upgop.sponsor_id,
        //                 "image": (user2[0] && user2[0].image ? (user2[0].image.indexOf('http') === -1 ? process.env.AWS_PATH + user2[0].image : user2[0].image) : null)
        //               };
        //             }

        //             userList.push({
        //               "sponsorUsername": uprop.sponsor,
        //               "country": uprop.country,
        //               "joinat": uprop.joinat,
        //               "name": uprop.name,
        //               "username": (uprop.username ? uprop.username : ''),
        //               "position": uprop.position,
        //               "sponsorStr": uprop.id,
        //               "sponsorMatchStr": uprop.sponsor_id,
        //               "image": (user1[0] && user1[0].image ? (user1[0].image.indexOf('http') === -1 ? process.env.AWS_PATH + user1[0].image : user1[0].image) : null),
        //               "count": (nusers[uprop.id] ? nusers[uprop.id] : 0)
        //             });
        //           }

        //           return that.out(200, {'hasError': false, 'parent': parent, 'users': userList}, null);
        //         });
        //       });
        //     }
        //     else {
        //       return that.out(200, {'hasError': true, 'message': 'Users not found.'}, e);
        //     }
        //   }
        //   else {
        //     return that.out(200, {'hasError': true, 'message': 'Users not found.'}, e);
        //   }
        // });
      }
      else {
        return that.out(200, {'hasError': true, 'message': 'Users not found.'}, e);
      }
    });
  }
}

module.exports = (request, reply) => {
  let myNetwork = new MyUniLevelNetwork(request, reply);
  return myNetwork.processRequest();
}