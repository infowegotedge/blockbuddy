'use strict';

let Validator  = require('./validators/request.validator');
let apiPath = process.env.SERVER_PATH + process.env.API_PATH;

// Purchase Route
let PurchaseRoutes = [
  // GET Purchase For Token
  {
    method: 'GET',
    path: apiPath + 'purchase',
    config: {
      handler: require('./actions/create')
    }
  }, 
  // POST Purchase Request
  {
    method: 'POST',
    path: apiPath + 'purchase/create',
    config: {
      auth: {
        scope: ['user']
      },
      validate: {
        payload: Validator.getPurchaseRequset()
      },
      handler: require('./actions/create')
    }
  }, 
  // GET Current Rates Request
  {
    method: 'GET',
    path: apiPath + 'current-rates',
    config: {
      handler: require('./actions/currentrates')
    }
  }, 
  // POST Current Rates Request
  {
    method: 'POST',
    path: apiPath + 'current-rates',
    config: {
      auth: {
        scope: ['user']
      },
      validate: {
        payload: Validator.getCurrentRates()
      },
      handler: require('./actions/currentrates')
    }
  }, 
  // POST Payments Request
  {
    method: 'POST',
    path: apiPath + 'payments',
    config: {
      auth: {
        scope: ['admin', 'user']
      },
      handler: require('./actions/payments')
    }
  }, 
  // POST Payments Request through PAYZA
  {
    method: 'POST',
    path: apiPath + 'payments/payza',
    config: {
      auth: {
        scope: ['admin', 'user']
      },
      handler: require('./actions/payments-payza')
    }
  },
  // POST Products Request
  {
    method: 'POST',
    path: apiPath + 'products',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.getProductRequest()
      },
      handler: require('./actions/create-products')
    }
  }, 
  // GET Payments List Request
  {
    method: 'GET',
    path: apiPath + 'products-list',
    config: {
      auth: {
        scope: ['admin', 'user']
      },
      handler: require('./actions/list-products')
    }
  }, 
  // GET Payments List Request
  {
    method: 'GET',
    path: apiPath + 'products-list-all',
    config: {
      auth: {
        scope: ['user']
      },
      handler: require('./actions/list-all-products')
    }
  },
  // GET Payments List Request
  {
    method: 'GET',
    path: apiPath + 'products-purchase-total',
    config: {
      handler: require('./actions/product-purchase')
    }
  },
  // POST Payments Call Back Request
  {
    method: 'GET',
    path: apiPath + 'purchase-call',
    config: {
      auth: false,
      handler: require('./actions/purchase-call')
    }
  },
  // GET Payments Call Back Request
  {
    method: 'GET',
    path: apiPath + 'payza-call',
    config: {
      auth: false,
      handler: require('./actions/payza-call')
    }
  },
  // GET Purchase Call Current Month Request
  {
    method: 'GET',
    path: apiPath + 'purchase-current-month',
    config: {
      handler: require('./actions/current-m-purchase')
    }
  },
  // POST Payments Call Back Request
  {
    method: 'POST',
    path: apiPath + 'purchase-order',
    config: {
      validate: {
        payload: Validator.getPurchaseOrderRequest()
      },
      handler: require('./actions/purchase-order')
    }
  },
  // POST Payments Call Back Request
  {
    method: 'POST',
    path: apiPath + 'payza-ipn',
    config: {
      auth: false,
      handler: require('./actions/payza-ipn')
    }
  }
];

module.exports = PurchaseRoutes;