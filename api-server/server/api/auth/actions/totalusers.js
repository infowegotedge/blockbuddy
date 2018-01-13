'use strict';

let ApiBaseActions = require('./../../apibase.actions');
let Neo4JDB        = require('./../../../component/neo4j_db');

class TotalMembers extends ApiBaseActions {

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
    let auth     = this.req.auth.credentials;
    let query    = this.req.query;
    let that     = this;
    let curPage  = (query.page ? query.page : 1);
    let perPage  = parseInt(process.env.PAGINATION_LIMIT);
    let offset   = ((curPage - 1) * perPage);
    let userList = [];

    // Neo4J DB User Count
    Neo4JDB.userCount(auth.id, function(e, uc) {
      if(!e) {
        // Neo4J DB User Total Users
        Neo4JDB.totalMyUsers(auth.id, offset, function(e, u) {
          if(!e && u) {
            let users = u.records.length;
            if(users !== 0) {
              for(let idx=0; idx<users; idx++) {
                let uprop = u.records[idx].get('n')['properties'];

                // Generate Out
                userList.push({
                  "level": uprop.position,
                  "sponsor": uprop.sponsor,
                  "country": uprop.country,
                  "joinat": uprop.joinat,
                  "name": uprop.name,
                  "username": (uprop.username ? uprop.username : ''),
                });
              }

              return that.out(200, {'hasError': false, 'users': userList, "totalRows": uc.records[0].get('count'), "currentPage": curPage, "perPage": perPage}, null)
            }
            else {
              return that.out(200, {'hasError': true, 'message': 'Users not found.'}, null);  
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
}

module.exports = (request, reply) => {
  let totalMembers = new TotalMembers(request, reply);
  return totalMembers.processRequest();
}