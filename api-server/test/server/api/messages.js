'use strict';

require('dotenv').config();
const Lab           = require('lab');
const Code          = require('code');
const Config        = require('../../../config');
const Hapi          = require('hapi');
const LoginPlugin   = require('../../../server/api/auth/AuthRoutes');
const MessagePlugin = require('../../../server/api/message/MessageRoutes')
const LoadModels    = require('./../../../model.manifest').loadModels;
const apiBasePath   = process.env.API_DIR_PATH;
const modelSuffix   = process.env.MODULE_SUFFIX;
const engine        = require('hapi-react')();
const validate      = require('./../../../server/api/auth/validators/token.validator');
const SignJWT       = require('./../../../server/component/sign_jwt');
const apiPath       = process.env.API_PATH;
const loginDetail   = JSON.stringify({username: 'srebrni10', password: 'web@123'});
const lab           = exports.lab = Lab.script();

let request;
let server;
let messageId;


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
      server.route(MessagePlugin);
      done();
    });
  });
});


// Test Case Start Here
lab.experiment('Message Send (Error - I)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'POST',
        url: apiPath+'message/send',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns Message Send', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/"value" must be an object/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Message Send (Error - II)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'POST',
        url: apiPath+'message/send',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({})
      };

      done();
    });
  });

  lab.test('it returns Message Send', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/"sent_to" is required/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Message Send (Error - III)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'POST',
        url: apiPath+'message/send',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          "sent_to": "asdfasdfdsaf"
        })
      };

      done();
    });
  });

  lab.test('it returns Message Send', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/"sent_to" must be an array/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Message Send (Error - IV)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'POST',
        url: apiPath+'message/send',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          "sent_to": ['asdfasdfdsaf', 'sadfasfsadf'],
        })
      };

      done();
    });
  });

  lab.test('it returns Message Send', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/"subject" is required/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Message Send (Error - V)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'POST',
        url: apiPath+'message/send',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          "sent_to": ["asdfasdfdsaf"],
          "subject": "asdfjaslfjsdfl",
        })
      };

      done();
    });
  });

  lab.test('it returns Message Send', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/"message" is required/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Message Send', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'POST',
        url: apiPath+'message/send',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          "sent_to": ["asdfasdfdsaf"],
          "subject": "asdfjaslfjsdfl",
          "message": "asdjfalsdfjsld jlsd fls f"
        })
      };

      done();
    });
  });

  lab.test('it returns Message Send', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.message).to.be.match(/Message is created successfully/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Message Inbox GET', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'GET',
        url: apiPath+'message/inbox',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns Message Inbox', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.messages).instanceof(Array);
      Code.expect(response.result.totalRows).to.be.match(/\d+/);
      Code.expect(response.result.currentPage).to.be.match(/\d+/);
      Code.expect(response.result.perPage).to.be.match(/\d+/);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Message Outbox GET', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'GET',
        url: apiPath+'message/sent',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns Message Outbox', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.messages).instanceof(Array);
      Code.expect(response.result.totalRows).to.be.match(/\d+/);
      Code.expect(response.result.currentPage).to.be.match(/\d+/);
      Code.expect(response.result.perPage).to.be.match(/\d+/);
      Code.expect(response.statusCode).to.equal(200);
      messageId = response.result.messages[0].id;
      done();
    });
  });
});


lab.experiment('Message List-Users POST (Error - I)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'POST',
        url: apiPath+'message/list-users',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns Message List-Users', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/"value" must be an object/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Message List-Users POST (Error - II)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'POST',
        url: apiPath+'message/list-users',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          "messageId": ""
        })
      };

      done();
    });
  });

  lab.test('it returns Message List-Users', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/"messageId" is not allowed to be empty/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Message List-Users POST (Error - III)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'POST',
        url: apiPath+'message/list-users',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          "messageId": "asdfasfsdaf"
        })
      };

      done();
    });
  });

  lab.test('it returns Message List-Users', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Unable to find message/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Message List-Users POST', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'POST',
        url: apiPath+'message/list-users',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          "messageId": messageId
        })
      };

      done();
    });
  });

  lab.test('it returns Message List-Users', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.usersName).equal("");
      Code.expect(response.result.usersEmail).equal("");
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});