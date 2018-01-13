'use strict';

let ApiBaseActions = require('./../../apibase.actions');
let Neo4JDB        = require('./../../../component/neo4j_db');

class MyNetwork extends ApiBaseActions {

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
   * Process Request
   */
  processRequest() {
    let auth     = this.req.auth.credentials;
    let query    = this.req.query;
    let Users    = this.app.users;
    let that     = this;
    let userList = [];
    let parent   = {};

    // Find User By UserName
    Users.findUserByUsername((query.username || auth.displayName), function(e, u) {
      if(!e && u) {
        // Find User By Team In Neo4J
        Neo4JDB.myTeam(auth.id, u._id, auth.scope[0], function(e, u) {
          if(!e && u) {
            let users = u.records.length;
            let userImage = [];
            let neo4JIds  = '';
            if(users !== 0) {
              for(let idx=0; idx<users; idx++) {
                let uprop = u.records[idx].get('n')['properties'];
                let upgop = u.records[idx].get('hs')['properties'];
                userImage.push(upgop.id);
                userImage.push(uprop.id);
              }

              Users.getUsersByIds(userImage, (e, ui) => {
                for(let idx=0; idx<users; idx++) {
                  let uprop = u.records[idx].get('n')['properties'];
                  let upgop = u.records[idx].get('hs')['properties'];
                  let user1  = that.filterById(ui, uprop.id);
                  let user2  = that.filterById(ui, upgop.id);
  
                  if (idx === 0) {
                    userList.push({
                      "sponsorUsername": upgop.sponsor,
                      "country": upgop.country,
                      "joinat": upgop.joinat,
                      "name": upgop.name,
                      "username": (upgop.username ? upgop.username : ''),
                      "position": upgop.position,
                      "sponsorStr": upgop.id,
                      "sponsorMatchStr": upgop.sponsor_id,
                      "image": (user2[0] && user2[0].image ? (user2[0].image.indexOf('http') === -1 ? process.env.AWS_PATH + user2[0].image : user2[0].image) : null)
                    });
                  }
  
                  userList.push({
                    "sponsorUsername": uprop.sponsor,
                    "country": uprop.country,
                    "joinat": uprop.joinat,
                    "name": uprop.name,
                    "username": (uprop.username ? uprop.username : ''),
                    "position": uprop.position,
                    "sponsorStr": uprop.id,
                    "sponsorMatchStr": uprop.sponsor_id,
                    "image": (user1[0] && user1[0].image ? (user1[0].image.indexOf('http') === -1 ? process.env.AWS_PATH + user1[0].image : user1[0].image) : null)
                  });
                }
                
                return that.__getOrderList(userList, function(orderList) {
                  return that.out(200, {'hasError': false, 'users': orderList}, null);
                });
              });
            }
            else {
              return that.out(200, {'hasError': true, 'message': 'Users not found.'}, e);  
            }
          }
          else {
            return that.out(200, {'hasError': true, 'message': 'Users not found.'}, e);
          }
        });
      }
      else {
        return that.out(200, {'hasError': true, 'message': 'Users not found.'}, e);
      }
    });
  }

  __outList(list, eleObj, index, leftright, cb) {
    let ele = eleObj;
    let len = list.length;
    if(ele) {
      let sponsorStr = ele.sponsorStr;
      let eleObj     = {};

      for(let idx=0; idx < len; idx++) {
        if(list[idx].position === leftright && list[idx].sponsorMatchStr === sponsorStr) {
          eleObj = list[idx];
        }
      }
      return cb(eleObj);
    }
    else {
      return cb({});
    }
  }

  __order(orderList, eleObj, list, orderLen, index, cb) {
    let that = this;

    if(index < orderLen) {
      that.__outList(list, eleObj, index, 'L', function(outL) {
        that.__outList(list, eleObj, index, 'R', function(outR) {
          orderList.push(outL);
          orderList.push(outR);
          return that.__order(orderList, orderList[(index+1)], list, orderLen, (index+1), cb);
        })
      })
    }
    else {
      return cb(orderList);
    }
  }

  __getOrderList(list, cb) {
    let orderList = [];
    let orderLen  = list.length;

    if(list.length === 0) {
      return cb(orderList);
    }
    else {
      orderList.push(list[0]);

      this.__order(orderList, orderList[0], list, 3, 0, function(orderList) {
        return cb(orderList);
      });
    }
  }
}

module.exports = (request, reply) => {
  let myNetwork = new MyNetwork(request, reply);
  return myNetwork.processRequest();
}