'use strict';

const Neo4JDB = require('./../../../component/neo4j_db');
let ApiBaseActions = require('./../../apibase.actions');
let jwt = require('jsonwebtoken');

class TotalMyUsers extends ApiBaseActions {

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
    let Users           = this.app.users;
    let Purchase        = this.app.payment;
    let AffiliatesCount = this.app.AffiliatesCount;
    let Ledger          = this.app.ledger;
    let auth            = this.req.auth.credentials;
    let _s              = this;
    
    Users.findDirectsCount(auth, null, function(_e, _t) {
      // Neo4JDB.userCount(auth.id, function(e, uc) {
        Purchase.totalPurchase(auth.id, (e1, p) => {
          AffiliatesCount.findCounts(auth.id, (e2, a) => {
            AffiliatesCount.findSignups(auth.id, (e2, a2) => {
              Ledger.referralAmount(auth.id, (e3, u3) => {
                return _s.out(200, {
                  "hasError": false, 
                  "directs": (_t.count ? _t.count : 0), 
                  "directsThisWeek": (_t.thisWeek > 0 ? (_t.thisWeek - _t.lastWeek) : 0),
                  // "totalUsers": (uc && uc.r.records && uc.r.records.length > 0 ? uc.r.records[0].get('count').low : 0),
                  // "totalUsersLastWeek": (uc && uc.r2 && uc.r2.records && uc.r2.records.length > 0 && uc.r2.records[0].get('count').low ? uc.r2.records[0].get('count').low - uc.r1.records[0].get('count').low : 0), 
                  "purchase": (p ? p : 0), 
                  "affiliateVisit": (a && a.count ? a.count : 0),
                  "affiliateVisitLastCount": (a && a.last7Days > 0 ? (a.last7Days - a.last14Days) : 0),
                  "affiliateSignup": (a2 && a2.count ? a2.count : 0),
                  "affiliateSignupLastCount": (a2 && a2.last7Days > 0 ? (a2.last7Days - a2.last14Days) : 0),
                  "affiliateEarning": (!e3 && u3 && u3[0] && u3[0].total ? u3[0].total : 0)
                });
              });
            });
          });
        });
      // });
    });
  }
}

module.exports = (request, reply) => {
  let totalMyUsers = new TotalMyUsers(request, reply);
  return totalMyUsers.processRequest();
}