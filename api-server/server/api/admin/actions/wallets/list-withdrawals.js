'use strict';

let ApiBaseActions = require('./../../../apibase.actions');
const moment = require('moment');

class ListWithdrawal extends ApiBaseActions {

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

  // Find Wallet Request
  findWallet(Wallet, filter, curPage, perPage) {
    let _s = this;
    Wallet.findWallet(filter, (curPage * 1), (perPage * 1), (e, w) => {
      if(!e) {
        return _s.out(200, {"hasError": false, "withdrawals": w.withdrawals, "totalRows": w.count, "currentPage": curPage, "perPage": perPage});
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Withdrawals not found."})
      }
    });
  }

  /**
   * Process Request
   */
  processRequest() {
    let Wallet  = this.app.wallet;
    let Users   = this.app.users;
    let query   = this.req.query;
    let curPage = (query.page ? query.page : 1);
    let perPage = (process.env.PAGINATION_LIMIT * 1);
    let filter  = {};
    let _s      = this;

    if(query.auto_withdraw) {
      filter.autoWithdraw = true
    }
    if(query.status) {
      filter.status = query.status;
    }

    switch (query.type) {
      case 'day':
        filter.minTime = moment().subtract(1, 'day').toISOString();
        filter.maxTime = moment().toISOString();
        break;
      case 'week':
        filter.minTime = moment().subtract(7, 'day').toISOString();
        filter.maxTime = moment().toISOString();
        break;
      case 'month':
        filter.minTime = moment().subtract(1, 'month').toISOString();
        filter.maxTime = moment().toISOString();
        break;
    }

    if(query.user_id) {
      Users.findUserByUsername(query.user_id, (e, u) => {
        if(e || !u) {
          return _s.out(200, {"hasError": true, "message": "Withdrawals not found for specified user."});
        }
        else {
          filter.userId = u._id;
          return _s.findWallet(Wallet, filter, curPage, perPage);
        }
      })
    }
    else {
      return _s.findWallet(Wallet, filter, curPage, perPage);
    }
  }
}

module.exports = (request, reply) => {
  let listWithdrawal = new ListWithdrawal(request, reply);
  return listWithdrawal.processRequest();
}