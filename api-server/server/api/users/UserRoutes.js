'use strict';

let Validator = require('./validators/request.validator');
let apiPath   = process.env.SERVER_PATH + process.env.API_PATH;

// Users Routes
let UserRoutes = [
  // GET Latest Signup
  {
    method: 'GET',
    path: apiPath + 'latest-signup',
    config: {
      handler: require('./actions/latestsignup')
    }
  }, 
  // GET User Team 
  {
    method: 'GET',
    path: apiPath + 'my-team',
    config: {
      validate: {
        query: Validator.getQueryParameters()
      },
      handler: require('./actions/mynetwork')
    }
  }, 
  // GET User Uni Level Team 
  {
    method: 'GET',
    path: apiPath + 'my-uni-level-team',
    config: {
      validate: {
        query: Validator.getQueryParameters()
      },
      handler: require('./actions/myunilevelnetwork')
    }
  }, 
  // POST User Avatar 
  {
    method: 'POST',
    path: apiPath + 'upload',
    config: {
      payload: {
        output: 'file',
        maxBytes: 5242880,
        parse: true
      },
      handler: require('./actions/fileupload')
    }
  }, 
  // GET Leader Board
  {
    method: 'GET',
    path: apiPath + 'leader-board',
    config: {
      handler: require('./actions/leaderboard')
    }
  }, 
  // POST User Tree Position
  {
    method: 'POST',
    path: apiPath + 'user-position',
    config: {
      auth: {
        scope: ['user']
      },
      validate: {
        payload: Validator.getUserPositionParameter()
      },
      handler: require('./actions/userposition')
    }
  }, 
  // GET User Position In Tree
  {
    method: 'GET',
    path: apiPath + 'user-position',
    config: {
      handler: require('./actions/userpositionget')
    }
  }, 
  // POST Two Factor Auth Request
  {
    method: 'POST',
    path: apiPath + 'two-factor',
    config: {
      validate: {
        payload: Validator.getEnable2FAParameter()
      },
      handler: require('./actions/enable2fa')
    }
  }, 
  // POST Validate Two Factor Auth Request
  {
    method: 'POST',
    path: apiPath + 'validate-two-factor',
    config: {
      validate: {
        payload: Validator.get2FAParameter()
      },
      handler: require('./actions/validate2fa')
    }
  }, 
  // GET Two Factor Auth Disable Request
  {
    method: 'GET',
    path: apiPath + 'disable-two-factor',
    config: {
      handler: require('./actions/disable2fa')
    }
  }, 
  // POST Two Factor Auth Disable Request
  {
    method: 'POST',
    path: apiPath + 'disable-two-factor',
    config: {
      validate: {
        payload: Validator.getDisable2FAParameter()
      },
      handler: require('./actions/disable2fa')
    }
  }, 
  // POST Affiliates Visit Request
  {
    method: 'POST',
    path: process.env.SERVER_PATH + '/api/affiliates-visit',
    config: {
      auth: false,
      handler: require('./actions/affiliates-visit')
    }
  },
  // POST Two Factor Auth Disable Request
  {
    method: 'GET',
    path: apiPath + 'top-affiliates',
    config: {
      handler: require('./actions/top-affiliates')
    }
  },
  {
    method: 'GET',
    path: apiPath + 'my-affiliates',
    config: {
      handler: require('./actions/my-affiliates')
    }
  },
  {
    method: 'GET',
    path: apiPath + 'cms',
    config: {
      handler: require('./actions/cms-content')
    }
  }
];

module.exports = UserRoutes;