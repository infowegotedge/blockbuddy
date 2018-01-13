'use strict';

let ApiBaseActions = require('./../../../apibase.actions');
const moment       = require('moment');

class TransferFee extends ApiBaseActions {

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

  /**
   * Filter User By ID
   * @param {Object} obj
   * @param {String} id
   */
  filterUser(obj, id) {
    return super.filterById(obj, id);
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

    if(query.from) {
      filter.from = moment(query.from).toISOString();
      filter.upTo = (query.upto ? moment(query.upto).toISOString() : moment().toISOString());
    }

    // Find Transfer Fee
    return Transfer.findTransferFee(filter, (curPage * 1), (perPage * 1), (e, a) => {
      if(!e && a) {
        let len = a.transfers.length;
        let userList = [];
        for(let idx=0; idx < len; idx++) {
          if(userList.indexOf(a.transfers[idx].to_userid) === -1) {
            userList.push(a.transfers[idx].to_userid);
          }

          if(userList.indexOf(a.transfers[idx].userid) === -1) {
            userList.push(a.transfers[idx].userid);
          }
        }

        // Find Users By Id
        Users.getUsersByIds(userList, (e, u) => {
          if(!e && u && u.length > 0) {
            let transfersList = [];
            for(let idx=0; idx < len; idx++) {
              let toUser   = _s.filterUser(u, a.transfers[idx].to_userid);
              let fromUser = _s.filterUser(u, a.transfers[idx].userid);

              toUser   = (toUser && toUser.length ? toUser[0] : null);
              fromUser = (fromUser && fromUser.length ? fromUser[0]: null);

              // Generate List
              transfersList.push({
                "created_at": a.transfers[idx].created_at,
                "amount_transfer": a.transfers[idx].amount_transfer,
                "amount_fee": a.transfers[idx].amount_fee,
                "amount": a.transfers[idx].amount,
                "status": a.transfers[idx].status,
                "to_username": (toUser.username || ''),
                "to_name": (toUser.fname || '') + ' ' + (toUser.lname || ''),
                "from_username": (fromUser.username || ''),
                "from_name": (fromUser.fname || '') + ' ' + (fromUser.lname || '')
              });
            }
            
            return _s.out(200, {"hasError": false, "transfers": transfersList, "totalRows": a.count, "currentPage": curPage, "perPage": perPage, "totalFee": a.totalFee});
          }
          else {
            return _s.out(200, {"hasError": false, "transfers": a.transfers, "totalRows": a.count, "currentPage": curPage, "perPage": perPage, "totalFee": a.totalFee});
          }
        });
      }
      else {
        return _s.out(200, {"hasError": true, "message": "No transfer found."});
      }
    });
  }
}

module.exports = (request, reply) => {
  let transferFee = new TransferFee(request, reply);
  return transferFee.processRequest();
}