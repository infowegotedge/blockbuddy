'use strict';

let Validator = require('./validators/request.validator');
let apiPath   = process.env.SERVER_PATH + process.env.API_PATH;

// Affiliates Routes
let AffiliatesRoutes = [
  // GET Affiliates Request
  {
    method: 'GET',
    path: apiPath + 'affiliates',
    config: {
      handler: require('./actions/create')
    }
  }, 
  // POST Affiliates Update Request
  {
    method: 'POST',
    path: apiPath + 'affiliates/update',
    config: {
      auth: {
        scope: ['user']
      },
      validate: {
        payload: Validator.getUpdateParameter()
      },
      handler: require('./actions/update')
    }
  }, 
  // POST Affiliates Create Request
  {
    method: 'POST',
    path: apiPath + 'affiliates/create',
    config: {
      auth: {
        scope: ['user']
      },
      validate: {
        payload: Validator.getPostParameter()
      },
      handler: require('./actions/create')
    }
  }, 
  // GET Affiliates List Request
  {
    method: 'GET',
    path: apiPath + 'affiliates/list',
    config: {
      handler: require('./actions/list')
    }
  }, 
  // POST Affiliates Invoice Request
  {
    method: 'POST',
    path: apiPath + 'affiliates/invoice/update',
    config: {
      auth: {
        scope: ['user']
      },
      validate: {
        payload: Validator.getPostHashParameter()
      },
      handler: require('./actions/btchash')
    }
  }
];

module.exports = AffiliatesRoutes;