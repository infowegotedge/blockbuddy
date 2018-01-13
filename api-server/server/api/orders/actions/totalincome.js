'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class TotalIncome extends ApiBaseActions {

  constructor(request, reply) {
    super(request, reply);
    this.req = request;
    this.app = request.server.settings.app;
  }

  out(code, data, error) {
    if(error) {
      super.logger.logError(error);
    }

    if(data.hasError) {
      super.logger.logWarning(data.message);
    }

    return super.response(code, data);
  }

  processRequest() {
    let Income      = this.app.orders;
    let auth        = this.req.auth;
    let that        = this;
    let totalIncome = {
      "coin": "BTC",
      "totalUSD": 0,
      "totalBTC": 0
    }
    
    Income.sumIncome(auth.credentials.id, function(e, u) {
      if(e) {
        return that.out(200, {"hasError": true, "message": 'Detail not found'}, e)
      }
      else {
        if(u.length !== 0) {
          totalIncome.totalUSD = u[0].totalUSD;
          totalIncome.totalBTC = u[0].totalBTC;
        }

        return that.out(200, {"hasError": false, "totalIncome": totalIncome}, null)
      }
    });
  }
}

module.exports = (request, reply) => {
  let totalincome = new TotalIncome(request, reply);
  return totalincome.processRequest();
}