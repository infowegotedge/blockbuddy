'use strict';

require('dotenv').config();
const Lab             = require('lab');
const Code            = require('code');
const Config          = require('../../../config');
const Hapi            = require('hapi');
const LoginPlugin     = require('../../../server/api/auth/AuthRoutes');
const UtilitiesPlugin = require('../../../server/api/utilities/UtilitiesRoutes')
const LoadModels      = require('./../../../model.manifest').loadModels;
const apiBasePath     = process.env.API_DIR_PATH;
const modelSuffix     = process.env.MODULE_SUFFIX;
const engine          = require('hapi-react')();
const validate        = require('./../../../server/api/auth/validators/token.validator');
const SignJWT         = require('./../../../server/component/sign_jwt');
const apiPath         = process.env.API_PATH;
const loginDetail     = JSON.stringify({username: 'srebrni10', password: 'web@123'});
const lab             = exports.lab = Lab.script();

let request;
let server;


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
      server.route(UtilitiesPlugin);
      done();
    });
  });
});


// Test Case Start Here
lab.experiment('Virtual Tree', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'GET',
        url: apiPath + 'virtualtree',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.error).equal(false);
      Code.expect(response.result.treeview).instanceOf(Object);
      Code.expect(response.result.treeview.username).to.be.match(/\w+/);
      Code.expect(response.result.treeview.name).to.be.match(/\w+/);
      Code.expect(response.result.treeview.doj).to.be.match(/\w+/);
      Code.expect(response.result.treeview.sponsor).to.be.match(/\w+/);
      // Code.expect(response.result.treeview.itemName).to.be.match(/\w+/);
      Code.expect(response.result.treeview.leftPV).to.be.match(/\w+/);
      Code.expect(response.result.treeview.rightPV).to.be.match(/\w+/);
      Code.expect(response.result.treeview.leftCount).to.be.match(/\w+/);
      Code.expect(response.result.treeview.rightCount).to.be.match(/\w+/);
      Code.expect(response.result.treeview.totalDirects).to.be.match(/\w+/);
      Code.expect(response.result.treeview.virtualPair).to.be.match(/\w+/);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


// lab.experiment('Packages', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       request = {
//         method: 'GET',
//         url: apiPath + 'package',
//         headers: {
//           "Authorization": response.result.token
//         }
//       };

//       done();
//     });
//   });

//   lab.test('it returns', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.error).equal(false);
//       Code.expect(response.result.package).instanceOf(Object);
//       Code.expect(response.result.package.pool).instanceOf(Object);
//       Code.expect(response.result.package.machine).instanceOf(Object);
//       Code.expect(response.result.package.rack).instanceOf(Object);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


lab.experiment('Total Team Members', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'GET',
        url: apiPath + 'total-team-members',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.totalTeam).to.be.match(/\d/);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('User Team Members', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'GET',
        url: apiPath + 'user-team-members',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.totalUsers).to.be.match(/\d/);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


// lab.experiment('Campaign POST (Error - I)', () => {

//   lab.beforeEach((done) => {
//     request = {
//       method: 'POST',
//       url: '/campaign'
//     };

//     done();
//   });

//   lab.test('it returns', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/"value" must be an object/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Campaign POST (Error - II)', () => {

//   lab.beforeEach((done) => {
//     request = {
//       method: 'POST',
//       url: '/campaign',
//       payload: JSON.stringify({})
//     };

//     done();
//   });

//   lab.test('it returns', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/"username" is required/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });



// lab.experiment('Campaign POST (Error - III)', () => {

//   lab.beforeEach((done) => {
//     request = {
//       method: 'POST',
//       url: '/campaign',
//       payload: JSON.stringify({
//         "username": "123123123"
//       })
//     };

//     done();
//   });

//   lab.test('it returns', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/"id" is required/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });



// lab.experiment('Campaign POST (Error - IV)', () => {

//   lab.beforeEach((done) => {
//     request = {
//       method: 'POST',
//       url: '/campaign',
//       payload: JSON.stringify({
//         "username": "123123123",
//         "id": "13123131"
//       })
//     };

//     done();
//   });

//   lab.test('it returns', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });



// lab.experiment('Campaign POST (Error - V)', () => {

//   lab.beforeEach((done) => {
//     request = {
//       method: 'POST',
//       url: '/campaign',
//       payload: JSON.stringify({
//         "username": "",
//         "id": "13123131"
//       })
//     };

//     done();
//   });

//   lab.test('it returns', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/"username" is not allowed to be empty/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });



// lab.experiment('Campaign POST (Error - VI)', () => {

//   lab.beforeEach((done) => {
//     request = {
//       method: 'POST',
//       url: '/campaign',
//       payload: JSON.stringify({
//         "username": "591fe64746abf912e28581b5",
//         "id": "13123131"
//       })
//     };

//     done();
//   });

//   lab.test('it returns', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });



// lab.experiment('Campaign POST (Error - VII)', () => {

//   lab.beforeEach((done) => {
//     request = {
//       method: 'POST',
//       url: '/campaign',
//       payload: JSON.stringify({
//         "username": "ravimehrotra89",
//         "id": "13123131"
//       })
//     };

//     done();
//   });

//   lab.test('it returns', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });



// lab.experiment('Campaign POST', () => {

//   lab.beforeEach((done) => {
//     request = {
//       method: 'POST',
//       url: '/campaign',
//       payload: JSON.stringify({
//         "username": "ravimehrotra89",
//         "id": "3"
//       })
//     };

//     done();
//   });

//   lab.test('it returns', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });