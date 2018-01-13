'use strict';

require('dotenv').config();
const Lab                  = require('lab');
const Code                 = require('code');
const Config               = require('../../../config');
const Hapi                 = require('hapi');
const ForgetPasswordPlugin = require('../../../server/api/forget-password/ForgetPasswordRoutes');
const LoadModels           = require('./../../../model.manifest').loadModels;
const apiBasePath          = process.env.API_DIR_PATH;
const modelSuffix          = process.env.MODULE_SUFFIX;
const engine               = require('hapi-react')();
const validate             = require('./../../../server/api/auth/validators/token.validator');
const SignJWT              = require('./../../../server/component/sign_jwt');
const apiPath              = process.env.API_PATH;
const email                = JSON.stringify({email: 'ravi@allies.co.in'});
const lab                  = exports.lab = Lab.script();

let request;
let server;
let token;


lab.beforeEach((done) => {

  server = new Hapi.Server();
  server.connection({ port: Config.get('/port/api') });
  server.register([
    {
      register: require('hapi-mongoose'),
      options: {
        bluebird: true,
        uri: 'mongodb://'+process.env.MONGOOSE_DB_PATH+'/'+process.env.MONGOOSE_DB
      }
    }, {
      register: require('bell')
    }, {
      register: require('hapi-auth-jwt2')
    }, {
      register: require('./../../../server/plugins/sign-jwt/sign-jwt.js')
    }, {
      register: require('acquaint'),
      options: {
        relativeTo: __dirname,
        routes: [
          {
            includes: [
              apiBasePath + '/**/*Routes.js',
              apiBasePath + '/index.js'
            ]
          }
        ],
      }
    }, {
      register: require('vision'),
      options: {}
    }
  ], (err) => {

    // PreResponse Handler to Catch BOOM Errors
    const preResponse = function (request, reply) {

      let response = request.response;
      // console.log(response);
      if (response.isBoom) {
        if (response.output.statusCode === 401) {
          // reply.state("auth-requester", request.url.href);
          // return reply.redirect('/auth/login');
          return reply({"hasError": true, "message": "Invalid Token"}).code(404);
        }
        // Replace error
        let error = response;
        let ctx = {
          statusCode: error.output.statusCode,
          error: error.output.payload.error,
          message: (error.isDeveloperError ? 'Oops! it\'s not you, it\'s us.' : error.output.payload.message),
          hasError: true
        };
        
        return reply(ctx).code(200);
      }
      
      return reply.continue();
    };

    // perRequest Handler
    const methodRequest = function (request, reply) {
      let Settings = request.server.settings.app.settings;
      let Rates    = request.server.settings.app.pmrrates;
      return Settings.getSettings((e, settings) => {
        request.server.settings.app.ConfigSettings = ((!e && settings) ? settings : null);
        return Rates.getRates((er, rates) => {
          request.server.settings.app.ConfigRates = ((!e && rates) ? rates : null);
          return reply.continue();
        });
      });
    }

    server.ext([
      {
        "type": 'onPreResponse', 
        "method": preResponse
      }, {
        "type": "onRequest", 
        "method": methodRequest
      }
    ]);

    // Authentication Strategy
    server.auth.strategy('token', 'sign-jwt', {
      key: SignJWT.certificate(),
      validateFunc: validate,
      verifyOptions: SignJWT.validateOptions()
    });

    server.auth.default('token');

    // Settings to make authentication cookie
    // session based
    server.state(process.env.AUTH_COOKIE_NAME, {
      ttl: null,
      isSecure: true,
      isHttpOnly: true,
      encoding: 'base64json',
      clearInvalid: true, // remove invalid cookies
      strictHeader: true // don't allow violations of RFC 6265
    });

    // Setting App models
    const hapiMongoose  = server.plugins['hapi-mongoose'];
    server.settings.app = LoadModels(apiBasePath, modelSuffix, hapiMongoose);

    // KickStart Web Server
    server.start(() => {
      server.route(ForgetPasswordPlugin);
      done();
    });
  });
});


// Test Case Start Here
lab.experiment('Forget Password POST (Error - I)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/forgot-password?__t=1'
    };

    done();
  });

  lab.test('it returns Forget Password (Error - I)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/"value" must be an object/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Forget Password POST (Error - II)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/forgot-password?__t=1',
      payload: JSON.stringify({email: ''})
    };

    done();
  });

  lab.test('it returns Forget Password (Error - II)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/"email" is not allowed to be empty/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Forget Password POST (Error - III)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/forgot-password?__t=1',
      payload: JSON.stringify({email: 'sadfasfasd'})
    };

    done();
  });

  lab.test('it returns Forget Password (Error - III)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/"email" must be a valid email/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Forget Password POST', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/forgot-password?__t=1',
      payload: email
    };

    done();
  });

  lab.test('it returns Forget Password', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.message).to.be.match(/Password reset link has been sent to your email Id/i);
      Code.expect(response.statusCode).to.equal(200);
      token = response.result.token;

      done();
    });
  });
});


lab.experiment('Change Password (Error - I)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/change-password'
    };

    done();
  });

  lab.test('it returns Change Password (Error - I)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/"value" must be an object/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Change Password No Token Parameter (Error - II)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/change-password',
      payload: JSON.stringify({"password": "ravi2681", "confirmpassword": "ravi2681"})
    };

    done();
  });

  lab.test('it returns Change Password (No Token Parameter) (Error _ II)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/"token" is required/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Change Password Invalid Token (Error - III)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/change-password',
      payload: JSON.stringify({"token": 'asdfasfsd', "password": "ravi2681", "confirmpassword": "ravi2681"})
    };

    done();
  });

  lab.test('it returns Change Password (Invalid Token) (Error - III)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/fails because/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Change Password (Error - IV)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/change-password',
      payload: JSON.stringify({"token": token})
    };

    done();
  });

  lab.test('it returns Change Password (Error - IV)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/"password" is required/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Change Password (Error - V)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/change-password',
      payload: JSON.stringify({"token": token, "password": "ravi2681"})
    };

    done();
  });

  lab.test('it returns Change Password (Error - V)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/"confirmpassword" is required/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Change Password (Error - VI)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/change-password',
      payload: JSON.stringify({"token": token, "password": "ravi2681!Q", "confirmpassword": "ravi2681"})
    };

    done();
  });

  lab.test('it returns Change Password (Error - VI)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Password and confirm password do not match/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Change Password Invalid Confirm Password - VII', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/change-password',
      payload: JSON.stringify({"token": token, "password": "ravi2681", "confirmpassword": "ravi2681!Q"})
    };

    done();
  });

  lab.test('it returns Change Password (Invalid Confirm Password - VII)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Password and confirm password do not match/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Change Password POST', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/change-password',
      payload: JSON.stringify({"token": token, "password": "ravi2681", "confirmpassword": "ravi2681"})
    };

    done();
  });

  lab.test('it returns Change Password', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.message).to.be.match(/Password changed successfully/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});