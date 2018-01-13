'use strict';

let Validator  = require('./validators/request.validator');
let apiPath    = process.env.SERVER_PATH + process.env.API_PATH;

// Routes
let KycRoutes = [
  // POST KYC Update Request
  {
    method: 'POST',
    path: process.env.SERVER_PATH + '/api/admin/update-kyc',
    config: {
      auth: {
        scope: ['admin', 'moderator', 'supervisor']
      },
      handler: require('./actions/update')
    }
  }, 
  // GET KYC Records Request
  {
    method: 'GET',
    path: process.env.SERVER_PATH + '/api/admin/get-kyc-records',
    config: {
      auth: {
        scope: ['admin', 'moderator', 'supervisor']
      },
      validate: {
        query: Validator.getKycGetParameter()
      },
      handler: require('./actions/list')
    }
  },
  // POST KYC Request
  {
    method: 'POST',
    path: apiPath + 'kyc-create',
    config: {
      auth: {
        scope: ['user']
      },
      validate: {
        query: Validator.getKycCreateParameter()
      },
      handler: require('./actions/create')
    }
  },
  // GET KYC Request
  {
    method: 'GET',
    path: apiPath + 'kyc',
    config: {
      auth: {
        scope: ['user']
      },
      handler: require('./actions/get-kyc')
    }
  },
  // PUT KYC Update Request
  {
    method: 'PUT',
    path: apiPath + 'update-kyc',
    config: {
      auth: {
        scope: ['user']
      },
      handler: require('./actions/updatekyc')
    }
  }
];

module.exports = KycRoutes;
