'use strict';

let ApiBaseActions    = require('./../../apibase.actions');
let BinaryCalculation = require('./binary.calculation');
let PurcahseConfig    = require('./../model/purchase.json');
let ValidateComponent = require('./../../../component/validate');
// let CoinBaseAPI       = require('./../../../component/coinbase_api');

class PurchaseCreate extends ApiBaseActions {

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
   * Output Generator
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
   * Process GET Request
   */
  doPaymentRequest() {
    let that     = this;
    let auth     = this.req.auth;
    let Token    = this.app.tokenvalidator
    let validate = new ValidateComponent(Token);

    validate.getRequestToken(auth.credentials.id, 'puchase', function(e, t) {
      if(!e) {
        return that.out(200, {"hasError": false, "token": t}, null)  
      }
      return that.out(200, {"hasError": true, "message": t}, e)
    });
  }

  /**
   * Process POST Request
   */
  processRequest() {
    let that           = this;
    let purchase       = this.app.purchase;
    let payment        = this.app.payment;
    let Orders         = this.app.orders;
    let payload        = this.req.payload;
    let auth           = this.req.auth;
    let Token          = this.app.tokenvalidator
    let validate       = new ValidateComponent(Token);
    let purchaseRates  = this.app.ConfigRates;

    validate.verifyRequest(auth.credentials.id, 'puchase', payload.token, function(e, t) {
      if(e) {
        return that.out(200, {"hasError": true, "message": t}, e);
      }
      else {
        let token                  = t;
        let purchasePriceAndAmount = purchaseRates[payload.name.toLowerCase()]
        let createdAt              = (new Date()).toISOString();
        payload.userid             = auth.credentials.id;
        payload.quantity           = parseInt(payload.quantity);
        payload.price              = parseInt(purchasePriceAndAmount.price);
        payload.amount             = (payload.price * payload.quantity);
        payload.status             = 'PAYMENT_PENDING'; // PurcahseConfig.purchaseStatus;
        payload.created_at         = createdAt;
        payload.updated_at         = createdAt;

        if(purchasePriceAndAmount.price !== payload.price) {
          return that.out(200, {"hasError": true, "message": "Invalid amount"}, null);
        }
        else {
          purchase.save(payload, purchasePriceAndAmount, function(_e, _p) {
            if(_e) {
              return that.out(200, {"hasError": true, "message": _p}, _e)
            }
            else {
              let addBinaryCalculation = _p.addBinaryCalculation;
              let purchase             = _p.purchase;
              payload.purchase_power   = (payload.quantity * purchasePriceAndAmount.power);
              payload.purchase_id      = purchase._id;

              Orders.saveOrder(payload, function(eo, o) {
                if(eo) {
                  purchase.remove(function(epr, pr) {
                    return that.out(200, {"hasError": true, "message": "Unable to place order."}, eo)
                  });
                }
                else {
                  if(addBinaryCalculation) {
                    BinaryCalculation.doExecute(purchase, auth.credentials, that.app, purchaseRates, function(__e, __p) {
                      if(__e) {
                        return that.out(200, {
                          "hasError": false,
                          "purchase": purchase._id,
                          "order": o._id,
                          "message": "Puchaser successfully but sponsor not get commission"
                        }, __e)
                      }
                      else {
                        return that.out(200, {
                          "hasError": false, 
                          "purchase": purchase._id,
                          "order": o._id,
                          "message": "Purchase successfully"
                        }, null)
                      }
                    });
                  }
                  else {
                    return that.out(200, {
                      "hasError": false,
                      "purchase": purchase._id,
                      "order": o._id,
                      "message": "Purchase successfully"
                    }, null)
                  }
                }
              });
            }
          });
        } // else close
      }
    });
  }
}

module.exports = (request, reply) => {
  let creator = new PurchaseCreate(request, reply);
  
  if(request.method == 'post') {
    return creator.processRequest();
  }
  
  return creator.doPaymentRequest();
}
