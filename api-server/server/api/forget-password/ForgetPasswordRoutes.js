'use strict';

let Validator  = require('./validators/request.validator');
let apiPath = process.env.API_PATH;

// Routes
let ForgetPasswordRoutes = [
  // POST Forget Password Request
  {
    method: 'POST',
    path: process.env.SERVER_PATH + '/auth/forgot-password',
    config: {
      auth: false,
      validate: {
        payload: Validator.postVaildator()
      },
      handler: require('./actions/forget')
    }
  }, 
  // POST Change Password Request
  {
    method: 'POST',
    path: process.env.SERVER_PATH + '/auth/change-password',
    config: {
      auth: false,
      validate: {
        payload: Validator.postChangePasswordValidator()
      },
      handler: require('./actions/change')
    }
  }
];

module.exports = ForgetPasswordRoutes;