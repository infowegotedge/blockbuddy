'use strict';

// let commissionPercentage = require('./../model/purchase.json');

class BinaryCalculation {

  doPurchasePool(_purchase, purchaseRates) {
    return ((_purchase.amount * purchaseRates.pool.precent) / 100);
  }

  doPurchaseMachine(_purchase, purchaseRates) {
    return ((_purchase.amount * purchaseRates.machine.precent) / 100);
  }

  doPurchaseRack(_purchase, purchaseRates) {
    return ((_purchase.amount * purchaseRates.rack.precent) / 100);
  }

  doExecute(_purchase, credentials, app, purchaseRates, cb) {
    let that          = this;
    let purchase      = app.purchase;
    let percentage    = 0;
    purchase.findPurchase(credentials.sponsorid, function(e, p) {
      
      if(e) {
        return cb(true, 'Sponsor not get commission');
      }

      let commissionAmount = 0;
      switch(p.name.toLowerCase()) {
        case 'pool':
          commissionAmount = that.doPurchasePool(_purchase, purchaseRates);
          break;
        case 'machine':
          commissionAmount = that.doPurchaseMachine(_purchase, purchaseRates);
          break;
        case 'rack':
          commissionAmount = that.doPurchaseRack(_purchase, purchaseRates);
          break;
      }
      
      if(typeof purchaseRates[p.name.toLowerCase()] !== 'undefined') {
        percentage = purchaseRates[p.name.toLowerCase()].precent;
      }

      purchase.saveCommission({
        "purchaseid": _purchase._id,
        "userid": credentials.id,
        "username": credentials.name,
        "sponsorid": credentials.sponsorid,
        "sponsorname": credentials.sponsorName,
        "name": _purchase.name,
        "percentage": percentage,
        "amount": commissionAmount,
        "created_at": _purchase.created_at,
        "updated_at": _purchase.updated_at,
        "status": _purchase.status,
      }, cb);
    });
  }
}

module.exports = new BinaryCalculation();
