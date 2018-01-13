'use strict';

let Validator  = require('./validators/request.validator');
let apiPath = process.env.SERVER_PATH + process.env.API_PATH;

let PurchaseRoutes = [
  // GET Total Income Request
  {
    method: 'GET',
    path: apiPath + 'total-income',
    config: {
      handler: require('./actions/totalincome')
    }
  }, 
  // GET Total Power Request
  {
    method: 'GET',
    path: apiPath + 'total-power',
    config: {
      handler: require('./actions/totalpurchasepower')
    }
  }
];

module.exports = PurchaseRoutes;