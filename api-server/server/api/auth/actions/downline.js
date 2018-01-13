'use strict';

const Neo4JDB = require('./../../../component/neo4j_db');
let ApiBaseActions = require('./../../apibase.actions');
// let jwt = require('jsonwebtoken');

class UserDownline extends ApiBaseActions {

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
   * 
   * @param {Array} obj 
   * @param {String} id 
   */
  filterById(obj, id) {
    return obj.filter((el) =>
      el.get('id') === id+''
    );
  }

  /**
   * Process Request
   */
  processRequest() {
    let Users  = this.app.users;
    let auth   = this.req.auth;
    let query  = this.req.query;
    let _s     = this;
    let page   = (query.page || 1);
    let ppRows = parseInt(process.env.PAGINATION_LIMIT);
    let offset = ((page - 1) * ppRows);
    
    Neo4JDB.myDownline(auth.credentials.id, offset, (e, u) => {
      if(!e) {
        let rows    = u.records.length;
        let user    = '';
        let members = [];
        for(let idx = 0; idx < rows; idx++) {
          user = (user ? user + ',' : '') + '"' + u.records[idx].get('n')['properties']['id'] + '"';
          members.push({
            "email": u.records[idx].get('n')['properties']['email'],
            "mobile": '',
            "created_at": u.records[idx].get('n')['properties']['joinat'],
            "userid": u.records[idx].get('n')['properties']['username'],
            "name": u.records[idx].get('n')['properties']['name'],
            "sponsor": u.records[idx].get('n')['properties']['sponsor'],
            "totalMembers": 0,
            "id": u.records[idx].get('n')['properties']['id']
          });
        }

        Neo4JDB.myDownlineCount(user, (ec, uc) => {
          if(!ec) {
            let rows = members.length;

            for(let idx = 0; idx < rows; idx++) {
              let user = this.filterById(uc.records, members[idx]['id']);
              if(user.length > 0) {
                members[idx].totalMembers = user[0].get('total_users')['low'];
              }
            }

            Neo4JDB.myDonwlineCount(auth.credentials.id, (ec, pc) => {
              return _s.out(200, {
                "hasError": false, 
                "downline": members, 
                "totalRows": ((pc && pc.records[0].get('total_members')) ? pc.records[0].get('total_members')['low'] : 0), 
                "currentPage": page, 
                "perPage": ppRows
              });
            });
          }
          else {

            Neo4JDB.myDonwlineCount(auth.credentials.id, (ec, pc) => {
              return _s.out(200, {"hasError": false, "downline": members, "totalRows": pc.records[0].get('total_members'), "currentPage": page, "perPage": ppRows});
            });
          }
        })
      }
      else {
        return _s.out(200, {"hasError": true, "message": "No users found."}, e)
      }
    });
  }
}

module.exports = (request, reply) => {
  let userDownline = new UserDownline(request, reply);
  return userDownline.processRequest();
}