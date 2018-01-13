'use strict';

let Validator = require('./validators/request.validator');
let apiPath   = process.env.SERVER_PATH + process.env.API_PATH;

// Utilities Routes 
let UtilitiesRoutes = [
  // Get Virtual Tree
  {
    method: 'GET',
    path: apiPath + 'virtualtree',
    config: {
      handler: require('./actions/virtualtree')
    }
  }, 
  // Get Total Team Members
  {
    method: 'GET',
    path: apiPath + 'total-team-members',
    config: {
      handler: require('./actions/companyteam')
    }
  }, 
  // Get User Team Members
  {
    method: 'GET',
    path: apiPath + 'user-team-members',
    config: {
      handler: require('./actions/usersteam')
    }
  }
];

module.exports = UtilitiesRoutes;