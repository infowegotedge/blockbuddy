'use strict';

const Neo4JDB = require('./../../../component/neo4j_db');
let ApiBaseActions = require('./../../apibase.actions');
let jwt = require('jsonwebtoken');

class UserDirects extends ApiBaseActions {

  /**
   * Constructor 
   * @param {Request} request
   * @param {Reply} reply
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
    let Users  = this.app.users;
    let auth   = this.req.auth;
    let query  = this.req.query;
    let _s     = this;
    let page   = query.page;
    let ppRows = parseInt(process.env.PAGINATION_LIMIT);
    let filter = null;

    if(query.email) {
      filter = query.email;
    }
    
    Users.findDirectsCount(auth.credentials, filter, function(_e, _t) {
      Users.findDirects(auth.credentials, query, filter, function(e, u) {
        if(e) {
          return _s.out(200, {"hasError": true, "message": u}, e)
        }
        else {
          let rows    = u.length;
          let user    = '';
          let members = [];
          for(let idx = 0; idx < rows; idx++) {
            user = (user ? user + ',' : '') + '"' + u[idx].userid + '"';
            members.push({
              "email": u[idx].email,
              "country": u[idx].country,
              "mobile": u[idx].mobile,
              "create_at": u[idx].create_at,
              "position": u[idx].position,
              "ctx": u[idx].userid,
              "userid": u[idx].username,
              "name": u[idx].name,
              "totalMembers": 0,
              "totalPurchasePV": 0
            });
          }

          // Neo4j Member Count
          Neo4JDB.memberCount(user, function(e, nu) {
            if(!e) {
              let nRows = nu.records.length;
              let nUser = [];
              for(let idx = 0; idx < nRows; idx++) {
                for(let idx1 = 0; idx1 < rows; idx1++) {
                  if(nu.records[idx].get('member_id') === members[idx1].ctx) {
                    members[idx1]['totalMembers']    = nu.records[idx].get('member_count')['low'];
                    members[idx1]['totalPurchasePV'] = nu.records[idx].get('totalPurchasePV')['low'];
                  }
                }
              }
              
              return _s.out(200, {"hasError": false, "directs": members, "totalRows": _t, "currentPage": page, "perPage": ppRows}, null);
            }
            else {
              return _s.out(200, {"hasError": false, "directs": members, "totalRows": _t, "currentPage": page, "perPage": ppRows}, e)
            }
          });
        }
      });
    });
  }
}

module.exports = (request, reply) => {
  let userDirects = new UserDirects(request, reply);
  return userDirects.processRequest();
}