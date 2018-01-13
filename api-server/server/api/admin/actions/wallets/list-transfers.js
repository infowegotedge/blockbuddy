'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class ListTransfers extends ApiBaseActions {

  /**
   * 
   * @param {Request} request 
   * @param {Reply} reply 
   */
  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  /**
   * 
   * @param {Number} code 
   * @param {Object} data 
   */
  out(code, data) {
    return super.response(code, data);
  }

  filterUser(obj, id) {
    return super.filterById(obj, id);
  }

  // Find Transfer
  findTransfer(Transfer, Users, filter, curPage, perPage) {
    let _s = this;
    Transfer.findTransfer(filter, (curPage * 1), (perPage * 1), (e, t) => {
      if(!e) {
        let len = t.transfers.length;
        let userList = [];
        for(let idx=0; idx < len; idx++) {
          if(userList.indexOf(t.transfers[idx].to_userid) === -1) {
            userList.push(t.transfers[idx].to_userid);
          }

          if(userList.indexOf(t.transfers[idx].userid) === -1) {
            userList.push(t.transfers[idx].userid);
          }
        }

        // Find Users By ID
        Users.getUsersByIds(userList, (e, u) => {
          if(!e && u && u.length > 0) {
            let transfersList = [];
            for(let idx=0; idx < len; idx++) {
              let toUser   = _s.filterUser(u, t.transfers[idx].to_userid);
              let fromUser = _s.filterUser(u, t.transfers[idx].userid);

              toUser   = (toUser && toUser.length ? toUser[0] : null);
              fromUser = (fromUser && fromUser.length ? fromUser[0]: null);

              // Generate Output List
              transfersList.push({
                "created_at": t.transfers[idx].created_at,
                "amount_transfer": t.transfers[idx].amount_transfer,
                "amount_fee": t.transfers[idx].amount_fee,
                "amount": t.transfers[idx].amount,
                "status": t.transfers[idx].status,
                "to_username": (toUser.username || ''),
                "to_name": (toUser.fname || '') + ' ' + (toUser.lname || ''),
                "from_username": (fromUser.username || ''),
                "from_name": (fromUser.fname || '') + ' ' + (fromUser.lname || '')
              });
            }
            
            return _s.out(200, {"hasError": false, "transfers": transfersList, "totalRows": t.count, "currentPage": curPage, "perPage": perPage});
          }
          else {
            return _s.out(200, {"hasError": false, "transfers": t.transfers, "totalRows": t.count, "currentPage": curPage, "perPage": perPage});
          }
        });
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Transfers not found."})
      }
    });
  }

  /**
   * Process Request
   */
  processRequest() {
    let Transfer = this.app.wallet;
    let Users    = this.app.users;
    let query    = this.req.query;
    let curPage  = (query.page ? query.page : 1);
    let perPage  = (process.env.PAGINATION_LIMIT * 1);
    let filter   = {};
    let _s       = this;

    if(query.status) {
      filter.status = query.status;
    }

    if(query.user_id) {
      // Find User By Username
      Users.findUserByUsername(query.user_id, (e, u) => {
        if(e || !u) {
          return _s.out(200, {"hasError": true, "message": "Transfers not found for specified user."});
        }
        else {
          filter.userId = u._id;
          return _s.findTransfer(Transfer, Users, filter, curPage, perPage);
        }
      })
    }
    else {
      return _s.findTransfer(Transfer, Users, filter, curPage, perPage);
    }
  }
}

module.exports = (request, reply) => {
  let listTransfers = new ListTransfers(request, reply);
  return listTransfers.processRequest();
}