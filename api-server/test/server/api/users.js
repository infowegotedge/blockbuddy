'use strict';

require('dotenv').config();
const Lab         = require('lab');
const Code        = require('code');
const Config      = require('../../../config');
const Hapi        = require('hapi');
const TwoFactor   = require('node-2fa');
const IndexPlugin = require('../../../server/api/users/UserRoutes');
const LoginPlugin = require('../../../server/api/auth/AuthRoutes');
const LoadModels  = require('./../../../model.manifest').loadModels;
const apiBasePath = process.env.API_DIR_PATH;
const modelSuffix = process.env.MODULE_SUFFIX;
const engine      = require('hapi-react')();
const validate    = require('./../../../server/api/auth/validators/token.validator');
const SignJWT     = require('./../../../server/component/sign_jwt');
const apiPath     = process.env.API_PATH;
const loginDetail = JSON.stringify({username: 'srebrni10', password: 'web@123'});
const lab         = exports.lab = Lab.script();

let request;
let server;
let key, code, secret;


lab.beforeEach((done) => {

  const plugin  = IndexPlugin;
  const plugin1 = LoginPlugin;

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
      server.route(plugin);
      server.route(plugin1);
      done();
    });
  });
});


// Test Case Start Here
lab.experiment('My Team', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'GET',
        url: apiPath + 'my-team',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns the my team', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.users).instanceOf(Array);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Leader Board', () => {
  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'GET',
        url: apiPath + 'leader-board',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns the leader-board', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.last7days).instanceOf(Array);
      Code.expect(response.result.last30Days).instanceOf(Array);
      Code.expect(response.result.allUsers).instanceOf(Array);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Latest Sign-up', () => {
  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'GET',
        url: apiPath + 'latest-signup',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns the latest sign-up', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.latestSignup).instanceOf(Array);
      Code.expect(response.statusCode).to.equal(200);
      done();
    });
  });
});


lab.experiment('User Position POST', () => {
  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'POST',
        url: apiPath + 'user-position',
        payload: JSON.stringify({position: 'L'}),
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns the user-position', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.message).to.be.match(/Position is save successfully/i);
      Code.expect(response.statusCode).to.equal(200);
      done();
    });
  });
});


lab.experiment('User Position GET', () => {
  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'GET',
        url: apiPath + 'user-position',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns the leader-board', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.position).to.be.match(/BOTH|L|R|WEAK/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


// lab.experiment('User Position Two Factor Auth Request', () => {
//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'two-factor',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({verifyBy: 'GOOGLE'})
//       };

//       done();
//     });
//   });

//   lab.test('it returns the two-factor', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(false);
//       Code.expect(response.result.twoFactor).instanceof(Object);
//       Code.expect(response.statusCode).to.equal(200);
//       key    = response.result.twoFactor.key;
//       code   = response.result.twoFactor.code;
//       secret = response.result.twoFactor.qrCode.split('secret=')[1];

//       done();
//     });
//   });
// });


// lab.experiment('User Position GET', () => {
//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let genToken = TwoFactor.generateToken(secret);

//       request = {
//         method: 'POST',
//         url: apiPath + 'validate-two-factor',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({key: key, verifyBy: code, token: genToken.token})
//       };

//       done();
//     });
//   });

//   lab.test('it returns the leader-board', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(false);
//       Code.expect(response.result.message).to.be.match(/Two factor enable successfully/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('User Disable Two Factor (Error - I)', () => {
//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       server.inject({method: 'POST', url: '/auth/verify-2fa', payload: JSON.stringify({})}, (response1) => {
//         Code.expect(response1.result.message).to.be.matches(/is required/i);
//         done();
//       });
//     });
//   });
//   lab.test('it returns the Disable Two Factor (Error - I)', (done) => {
//     done();
//   });
// });


// lab.experiment('User Disable Two Factor (Error - II)', () => {

//   lab.beforeEach((done) => {

//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {

//       server.inject({method: 'POST', url: '/auth/verify-2fa', payload: JSON.stringify({
//         key: 'asdfassadfsd',
//         token_key: 'sadfasdfaf',
//         token: '1231231',
//         verifyBy: 'GOOGLE'
//       })}, (response1) => {
//         Code.expect(response1.result.hasError).equal(true);
//         Code.expect(response1.result.message).to.be.matches(/Invalid verify token/i);
//         done();
//       });

//     });
//   });

//   lab.test('it returns the Disable Two Factor (Error - II)', (done) => {
//     done();
//   });
// });


// lab.experiment('User Disable Two Factor (Error - III)', () => {

//   lab.beforeEach((done) => {

//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {

//       server.inject({method: 'POST', url: '/auth/verify-2fa', payload: JSON.stringify({
//         key: response.result.key
//       })}, (response1) => {
//         Code.expect(response1.result.message).to.be.matches(/"token_key" is required/i);
//         done();
//       });

//     });
//   });

//   lab.test('it returns the Disable Two Factor (Error - III)', (done) => {
//     done();
//   });
// });


// lab.experiment('User Disable Two Factor (Error - IV)', () => {

//   lab.beforeEach((done) => {

//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {

//       server.inject({method: 'POST', url: '/auth/verify-2fa', payload: JSON.stringify({
//         key: response.result.key,
//         token_key: response.result.token_key,
//       })}, (response1) => {
//         Code.expect(response1.result.message).to.be.matches(/"token" is required/i);
//         done();
//       });

//     });
//   });

//   lab.test('it returns the Disable Two Factor (Error - IV)', (done) => {
//     done();
//   });
// });


// lab.experiment('User Disable Two Factor (Error - V)', () => {

//   lab.beforeEach((done) => {

//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let genToken = TwoFactor.generateToken(secret);
      
//       server.inject({method: 'POST', url: '/auth/verify-2fa', payload: JSON.stringify({
//         key: response.result.key,
//         token_key: response.result.token_key,
//         token: genToken.token,
//       })}, (response1) => {
//         Code.expect(response1.result.message).to.be.matches(/"verifyBy" is required/i);
//         done();
//       });

//     });
//   });

//   lab.test('it returns the Disable Two Factor (Error - V)', (done) => {
//     done();
//   });
// });


// lab.experiment('User Disable Two Factor', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {

//       let genToken = TwoFactor.generateToken(secret);

//       server.inject({method: 'POST', url: '/auth/verify-2fa', payload: JSON.stringify({
//         key: response.result.key,
//         token_key: response.result.token_key,
//         token: genToken.token,
//         verifyBy: response.result.code
//       })}, (response1) => {

//         request = {
//           method: 'GET',
//           url: apiPath + 'disable-two-factor',
//           headers: {
//             "Authorization": response1.result.token
//           }
//         };

//         done();

//       });

//     });
//   });

//   lab.test('it returns the leader-board', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(false);
//       Code.expect(response.result.message).to.be.match(/Message sent/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('User Disable Two Factor POST', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let genToken = TwoFactor.generateToken(secret);

//       server.inject({method: 'POST', url: '/auth/verify-2fa', payload: JSON.stringify({
//         key: response.result.key,
//         token_key: response.result.token_key,
//         token: genToken.token,
//         verifyBy: response.result.code
//       })}, (response1) => {

//         let genToken = TwoFactor.generateToken(secret);

//         request = {
//           method: 'POST',
//           url: apiPath + 'disable-two-factor',
//           headers: {
//             "Authorization": response1.result.token
//           },
//           payload: JSON.stringify({token: genToken.token})
//         };

//         done();

//       });
//     });
//   });

//   lab.test('it returns the disable-two-factor', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(false);
//       Code.expect(response.result.message).to.be.match(/Two factor authentication is disabled/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });