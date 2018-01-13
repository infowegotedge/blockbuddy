'use strict';

let ApiBaseActions = require('./../../apibase.actions');
let TeamMembers    = require('./../../../component/neo4j_db');

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
    let that        = this;
    let teamMembers = TeamMembers;
    let query       = this.req.query;
    let page        = (query.page || 1);
    let limit       = (query.limit || parseInt(process.env.PAGINATION_LIMIT));
    let offset      = (limit * (page - 1));
    let member      = {
      "id": this.req.auth.credentials.id,
      "skip": offset,
      "limit": limit
    }

    teamMembers.findTeamMemberCount(member.id, function(e, teamCount) {
      teamMembers.findTeamMembers(member, function(e, u) {
        if(e) {
          return that.out(200, {"hasError": true, "message": "No team members found"}, e);
        }
        else {
          let list = [];
          for(let idx in u.records) {
            list.push(u.records[idx].get('n')['properties']);
          }
          return that.out(200, {"hasError": false, "teamMembers": list, "totalRows": teamCount.records[0].get('totalRows')}, null);
        }
      });
    });
  }
}

module.exports = (request, reply) => {
  let userDirects = new UserDirects(request, reply);
  return userDirects.processRequest();
}