'use strict';

let ApiBaseActions = require('./../../../apibase.actions');

class WithdrawalApprovedRejected extends ApiBaseActions {

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
    let Ledger     = this.app.ledger;
    let Withdrawal = this.app.wallet;
    let Message    = this.app.messages;
    let payload    = this.req.payload;
    let _s         = this;

    Withdrawal.findWithdrawalById(payload.id, (e, w) => {
      if(!e && w) {
        Ledger.update({"object_id": w._id}, {"status": payload.status}, (e, ledger) => {
          if(!e && ledger.nModified > 0) {
            Withdrawal.updateWithdrawalAdmin(payload, (e, withdrawal) => {
              if(!e || withdrawal.nModified > 0) {
                Message.saveNotification(w.userid, "Withdrawal marked as " + payload.status + " successfully.", (e, r) => {
                  return _s.out(200, {"hasError": false, "message": "Withdrawal marked as " + payload.status + " successfully."});
                });
              } 
              else {
                return _s.out(200, {"hasError": true, "message": "Withdrawal Not Found."})
              }
            });
          }
          else {
            return _s.out(200, {"hasError": true, "message": "Withdrawal Not Found."})
          }
        });
      }
      else {
        return _s.out(200, {"hasError": true, "message": "Withdrawal Not Found."})
      }
    });
  }
}

module.exports = (request, reply) => {
  let withdrawalApprovedRejected = new WithdrawalApprovedRejected(request, reply);
  return withdrawalApprovedRejected.processRequest();
}