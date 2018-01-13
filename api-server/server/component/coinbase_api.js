'use strict';

const uuidV1   = require('uuid/v1');
const coinbase = require('coinbase');

class CoinBaseAPI {

  // constructor(apiKey, apiSecret, accountAddress) {
  constructor(apiKey, apiSecret) {
    this.client  = new coinbase.Client({'apiKey': apiKey, 'apiSecret': apiSecret});
  }

  /**
   * Create Account
   * @param {String} account 
   * @param {callback} cb 
   */
  createAccount(account, cb) {
    this.client.createAccount(account, (err, account) => {
      if(err) {
        return cb(true, 'Unable to create account');
      }
      else {
        return cb(false, account);
      }
    });
  }

  /**
   * Get Account
   * @param {String} account 
   * @param {callback} cb 
   */
  getAccount(accountId, cb) {
    this.client.getAccount(accountId, (err, account) => {
      if(err) {
        return cb(true, 'Not able to get Account.');
      }

      return cb(false, account);
    });
  }

  /**
   * Get Address
   * @param {String} accountId
   * @param {callback} cb 
   */
  getAddress(accountId, cb) {
    
    this.client.getAccount(accountId, (err, account) => {
      if(err) {
        return cb(true, 'Not able to get Account.');
      }

      account.getAddresses(null, (_err, address) => {
        if(_err) {
          return cb(true, 'Not able to get Account.')
        }

        return cb(false, address[0]);
      });
    });
  }

  /**
   * Create Address
   * @param {String} name
   * @param {String} accountId 
   * @param {callback} cb 
   */
  createAddress(name, accountId, cb) {

    this.client.getAccount(accountId, (err, account) => {
      if(err) {
        return cb(true, 'Not able to get Account.')
      }

      account.createAddress({'name': name}, (e, info) => {
        if(e) {
          return cb(true, 'Unable to get new Address.')
        }

        return cb(false, {
          'invoice': info.id,
          'address': info.address
        });
      });
    });
  }

  /**
   * Get Transactions
   * @param {String} accountId 
   * @param {callback} cb 
   */
  getTransactions(accountId, cb) {

    this.client.getAccount(accountId, (err, account) => {
      if(err) {
        return cb(true, 'Not able to get Account.')
      }
      
      account.getTransactions(null, (e, info, pagination) => {
        if(e) {
          return cb(true, 'Unable to get new Address.')
        }

        if(pagination.next_uri !== null) {
          account.getTransactions(pagination, (e1, info1, pagination1) => {
            if(e1) {
              return cb(false, {"info1": info, "info2": null});
            }

            return cb(false, {"info1": info, "info2": info1});
          })
        }
        else {
          return cb(false, {"info1": info, "info2": null});
        }
      });
    });
  }
}

module.exports = CoinBaseAPI;