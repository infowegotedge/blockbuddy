'use strict';

let ApiBaseActions = require('./../../apibase.actions');
const Neo4JDB      = require('./../../../component/neo4j_db');

class UsersTeam extends ApiBaseActions {

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
    let _s       = this;

    Neo4JDB.userCount(auth.id, function(e, c) {
      if(!e) {
        return _s.out(200, {"hasError": false, "totalUsers": c.records[0].get('count')}, null);
      }

      return _s.out(200, {"hasError": true, "message": 'No user found.'}, e);
    });
  }
}

module.exports = (request, reply) => {
  let usersTeam = new UsersTeam(request, reply);
  return usersTeam.processRequest();
}