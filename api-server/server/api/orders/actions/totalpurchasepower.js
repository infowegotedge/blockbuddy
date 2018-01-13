'use strict';

let ApiBaseActions = require('./../../apibase.actions');

class TotalPurchasePower extends ApiBaseActions {

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
    let Orders     = this.app.orders;
    let auth       = this.req.auth;
    let that       = this;
    let totalPower = {
      "coin": "BTC",
      "miningPower": 0
    }
    
    Orders.sumPurchasedPower(auth.credentials.id, function(e, u) {
      if(e) {
        return that.out(200, {"hasError": true, "message": 'Detail not found'}, e)
      }
      else {
        if(u.length !== 0) {
          totalPower.miningPower = u[0].totalPower;
        }

        return that.out(200, {"hasError": false, "totalPower": totalPower}, null)
      }
    });
  }
}

module.exports = (request, reply) => {
  let totalpurchasepower = new TotalPurchasePower(request, reply);
  return totalpurchasepower.processRequest();
}