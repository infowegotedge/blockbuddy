'use strict';

require('dotenv').config();
const Lab         = require('lab');
const Code        = require('code');
const Config      = require('../../../config');
const Hapi        = require('hapi');
const LoginPlugin = require('../../../server/api/auth/AuthRoutes');
const Affiliates  = require('../../../server/api/affiliates/AffiliatesRoutes');
const LoadModels  = require('./../../../model.manifest').loadModels;
const apiBasePath = process.env.API_DIR_PATH;
const modelSuffix = process.env.MODULE_SUFFIX;
const engine      = require('hapi-react')();
const validate    = require('./../../../server/api/auth/validators/token.validator');
const SignJWT     = require('./../../../server/component/sign_jwt');
const apiPath     = process.env.API_PATH;
const loginDetail = JSON.stringify({username: 'ravimehrotra89', password: 'ravi2681'});
const lab         = exports.lab = Lab.script();

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
      server.route(LoginPlugin);
      server.route(Affiliates);
      done();
    });
  });
});


// Test Case Start Here
lab.experiment('Affiliates Create GET', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'GET',
        url: apiPath + 'affiliates',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns Affiliates', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.token).to.be.match(/(\w+)-(\w+)-(\w+)-(\w+)-(\w+)/i);
      Code.expect(response.statusCode).to.equal(200);
      token = response.result.token;
      done();
    });
  });
});


lab.experiment('Affiliates List GET', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'GET',
        url: apiPath + 'affiliates/list',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns Affiliates List', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.affiliates).instanceOf(Object);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});