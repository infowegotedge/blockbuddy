'use strict';

let Validator = require('./validators/request.validator');
let apiPath   = process.env.SERVER_PATH + process.env.API_PATH;

// Wallet Routes
let WalletRoutes = [
  {
    // GET Wallet BTC Info Address 
    method: 'GET',
    path: apiPath + 'wallet/btc-info/address',
    config: {
      handler: require('./actions/btcaddress')
    }
  }, 
  // GET Wallet BTC Info 
  {
    method: 'GET',
    path: apiPath + 'wallet/btc-info',
    config: {
      handler: require('./actions/btcamount')
    }
  }, 
  // GET USD Wallet Info
  {
    method: 'GET',
    path: apiPath + 'wallet/usd-info',
    config: {
      handler: require('./actions/amount')
    }
  }, 
  // POST Create BTC Wallet Address
  {
    method: 'POST',
    path: apiPath + 'wallet/btc-info/create',
    config: {
      auth: {
        scope: ['user']
      },
      validate: {
        payload: Validator.getPostParameter(),
      }, 
      handler: require('./actions/btccreate')
    }
  }, 
  // POST BTC Address Update
  {
    method: 'POST',
    path: apiPath + 'wallet/btc-info/update',
    config: {
      auth: {
        scope: ['user']
      },
      validate: {
        payload: Validator.getPostParameter()
      },
      handler: require('./actions/btcupdate')
    }
  }, 
  // POST Withdrawal Request
  {
    method: 'POST',
    path: apiPath + 'wallet/withdrawal',
    config: {
      auth: {
        scope: ['user']
      },
      validate:{
        payload: Validator.getWithdrawalParameter()
      },
      handler: require('./actions/withdrawal')
    }
  }, 
  // GET Withdrawal Request
  {
    method: 'GET',
    path: apiPath + 'wallet/withdrawal',
    config: {
      handler: require('./actions/withdrawal')
    }
  }, 
  // GET Withdrawal Request
  {
    method: 'GET',
    path: apiPath + 'wallet/commission-list',
    config: {
      handler: require('./actions/list-commission')
    }
  }, 
  // GET Wallet Transfer Request
  {
    method: 'POST',
    path: apiPath + 'wallet/transfer',
    config: {
      auth: {
        scope: ['user', 'admin']
      },
      validate:{
        payload: Validator.getTransferParameter()
      },
      handler: require('./actions/transfer')
    }
  }, 
  // GET Wallet Transfer Token
  {
    method: 'GET',
    path: apiPath + 'wallet/transfer',
    config: {
      handler: require('./actions/transfer')
    }
  }, 
  // GET Wallet Ledger
  {
    method: 'GET',
    path: apiPath + 'wallet/ledger',
    config: {
      handler: require('./actions/list')
    }
  },
  // GET Wallet Ledger (Withdraw And Transfer)
  {
    method: 'GET',
    path: apiPath + 'wallet/ledger-withdraw-transfer',
    config: {
      handler: require('./actions/list-withdraw-transfer')
    }
  },
  // GET Withdrawal
  {
    method: 'GET',
    path: apiPath + 'withdrawal',
    config: {
      handler: require('./actions/list-withdrawals')
    }
  }
];

module.exports = WalletRoutes;