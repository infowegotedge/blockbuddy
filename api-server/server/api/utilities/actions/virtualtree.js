'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class VirtualTree extends ApiBaseActions {

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
   */
  out(code, data) {
    return super.response(code, data);
  }

  /**
   * Process Request
   */
  processRequest() {
    let Purchase = this.app.purchase;
    let Users    = this.app.users;
    let auth     = this.req.auth;
    let _s       = this;

    // Find User
    Users.query({id: auth.credentials.id}, function(en, un) {
      // Find User Directs
      Users.findDirectsCount(auth.credentials, null, function(e, u) {
        // Find Purchase
        Purchase.findPurchase(auth.credentials.id, function(e1, pu) {
          // Find All Purchase
          Purchase.findAllPurchase(auth.credentials.id, function(e2, p) {
            if(e1 || (!e1 && !pu)) pu = null;
            if(e2 || (!e2 && !p)) p = null;

            return _s.out(200, {'error': false, 'treeview': {
              "username": auth.credentials.displayName,
              "name": auth.credentials.name,
              "doj": un.created_at,
              "sponsor": auth.credentials.sponsorid,
              "itemName": (pu ? pu.name : ''),
              "leftPV" : (p ? p.left_pv_count : 0), 
              "rightPV" : (p ? p.right_pv_count : 0), 
              "leftCount" : (p ? p.left_count : 0), 
              "rightCount" : (p ? p.right_count : 0),
              "totalDirects": u,
              "virtualPair": (p ? ((p.left_count >= p.right_count) ? p.right_count : p.left_count) : 0),
            }})
          });
        });
      });
    });
  }
}

module.exports = (request, reply) => {
  let virtualTree = new VirtualTree(request, reply);
  return virtualTree.processRequest();
}