'use strict';

let Validator = require('./validators/request.validator');
let apiPath   = process.env.SERVER_PATH + process.env.API_PATH;
const Relish  = require('relish')({
  messages: {
    'email': 'Please enter your correct email',
    'fname': 'Please enter your First name',
    'lname': 'Please enter your Last name',
    'mobile': 'Please enter your mobile number. It must be 10 digit long.',
    'sponsorid': 'Please provide your Sponsor Id',
    'country': 'Please enter your country',
    'username': 'Please enter your Username. It must be alphanumeric (no space) and 5 charaters long',
    'password': 'Please enter your Password',
    'oldpassword': 'Please enter your Old Password',
    'confirmpassword': 'Please enter your Confirm Password'
  }
});

// Auth Routes
let AuthRoutes = [
  // Welcome Message
  {
    method: 'GET',
    path: '/',
    config: {
      auth: false,
      handler: function(request, reply) {
        return reply('Welcome to BBApp').code(200);
      }
    }
  }, 
  // GET Me Request
  {
    method: 'GET',
    path: process.env.SERVER_PATH + '/api/me',
    config: {
      handler: require('./actions/user')
    }
  },
  // POST User Verify Request
  {
    method: 'POST',
    path: process.env.SERVER_PATH + '/api/user-verify',
    config: {
      auth: {
        scope: ['user']
      },
      handler: require('./actions/user-verify')
    }
  }, 
  // POST Login Request
  {
    method: 'POST',
    path: process.env.SERVER_PATH + '/auth/login',
    config: {
      auth: false,
      validate: {
        failAction: Relish.failAction,
        payload: Validator.getLoginParameter()
      },
      handler: require('./actions/login')
    }
  },
  // POST Login OR SignUp Request
  {
    method: 'POST',
    path: process.env.SERVER_PATH + '/auth/social',
    config: {
      auth: false,
      validate: {
        failAction: Relish.failAction,
        payload: Validator.getLoginOrSignUpParameter()
      },
      handler: require('./actions/login-signup')
    }
  }, 
  // POST verify 2FA Request
  {
    method: 'POST',
    path: process.env.SERVER_PATH + '/auth/verify-2fa',
    config: {
      auth: false,
      validate: {
        payload: Validator.getVerify2FAParameter()
      },
      handler: require('./actions/verify2fa')
    }
  }, 
  // POST Forget 2FA Request
  {
    method: 'POST',
    path: process.env.SERVER_PATH + '/auth/forget-2fa',
    config: {
      auth: false,
      validate: {
        payload: Validator.getForget2FAParameter()
      },
      handler: require('./actions/forget2fa')
    }
  }, 
  // POST Signup Request
  {
    method: 'POST',
    path: process.env.SERVER_PATH + '/auth',
    config: {
      auth: false,
      validate: {
        failAction: Relish.failAction,
        payload: Validator.getSignupParameter(),
      },
      handler: require('./actions/local')
    }
  }, 
  // POST Sponsor Info Request
  {
    method: 'POST',
    path: process.env.SERVER_PATH + '/api/sponsor-info',
    config: {
      auth: false,
      validate: {
        payload: Validator.getQueryParameter()
      },
      handler: require('./actions/sponsorinfo')
    }
  }, 
  // POST Verify Email Request
  {
    method: 'POST',
    path: process.env.SERVER_PATH + '/auth/verify-email',
    config: {
      auth: false,
      validate: {
        payload: Validator.getEmailParameter()
      },
      handler: require('./actions/emailverify')
    }
  }, 
  // POST Add User Request By An User
  {
    method: 'POST',
    path: apiPath + 'add-user',
    config: {
      validate: {
        failAction: Relish.failAction,
        payload: Validator.getAddUserParameter()
      },
      handler: require('./actions/local')
    }
  }, 
  // POST Change Password Request By User Though Setting/ Profile Page
  {
    method: 'POST',
    path: process.env.SERVER_PATH + '/api/change-password',
    config: {
      validate: {
        failAction: Relish.failAction,
        payload: Validator.getChangePasswordParameter(),
      },
      handler: require('./actions/changepassword')
    }
  }, 
  // POST User Profile Page
  {
    method: 'POST',
    path: apiPath + 'profile',
    config: {
      validate: {
        failAction: Relish.failAction,
        payload: Validator.getPofileParameter(),
      },
      handler: require('./actions/profile')
    }
  }, 
  // GET User Directs
  {
    method: 'GET',
    path: apiPath + 'directs',
    config: {
      validate: {
        query: Validator.getDirectsQueryParameter()
      },
      handler: require('./actions/directs')
    }
  }, 
  // GET User Downline
  {
    method: 'GET',
    path: apiPath + 'downline',
    config: {
      validate: {
        query: Validator.getDirectsQueryParameter()
      },
      handler: require('./actions/downline')
    }
  },
  // GET User Team Member
  {
    method: 'GET',
    path: apiPath + 'team-members',
    config: {
      validate: {
        query: Validator.getTeamMemberQueryParameter()
      },
      handler: require('./actions/teammembers')
    }
  }, 
  // GET User Logout
  {
    method: 'GET',
    path: process.env.SERVER_PATH + '/api/me/logout',
    config: {
      handler: require('./actions/logout')
    }
  }, 
  // GET Total Users Request
  {
    method: 'GET',
    path: apiPath + 'total-users',
    config: {
      handler: require('./actions/totalusers')
    }
  },
  // GET Total Users Request
  {
    method: 'GET',
    path: apiPath + 'total-users-count',
    config: {
      handler: require('./actions/total-myusers')
    }
  },
  // POST Total Users Request
  {
    method: 'POST',
    path: apiPath + 'resume',
    config: {
      handler: require('./actions/resume-login')
    }
  }
];

module.exports = AuthRoutes;
