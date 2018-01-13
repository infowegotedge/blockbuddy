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
const loginDetail = JSON.stringify({username: 'srebrni10', password: 'web@123'});
const lab         = exports.lab = Lab.script();

let request;
let server;
let token;
let invoiceNo;
let tokenAffiliates;
let affiliateDetails = {username: 'ravimehrotra', password: 'ravi2681'}


lab.beforeEach((done) => {

  const plugin = LoginPlugin;

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
      server.route(plugin);
      server.route(Affiliates);
      done();
    });
  });
});


// Test Case Start Here
lab.experiment('Route GET', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'GET',
      url: '/',
    };

    done();
  });

  lab.test('it returns', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result).to.be.match(/Welcome to BBApp/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Login (Error - I)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/login',
    };

    done();
  });

  lab.test('it returns Login (Error - I)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/must be an object/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Login (Error - II)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/login',
      payload: JSON.stringify({username: 'asdfasfs'})
    };

    done();
  });

  lab.test('it returns Login (Error - II)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your Password/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Login (Error - III)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/login',
      payload: JSON.stringify({username: 'asdfasfs', password: 'sdfjaslsdf'})
    };

    done();
  });

  lab.test('it returns Login (Error - III)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Username or Password is incorrect/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Login (Error - IV)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/login',
      payload: JSON.stringify({username: 'ravimehrotra89', password: 'sdfjaslsdf'})
    };

    done();
  });

  lab.test('it returns Login (Error - IV)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Username or Password is incorrect/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Login', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/login',
      payload: loginDetail
    };

    done();
  });

  lab.test('it returns Login', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.token).to.be.match(/\w+/);
      Code.expect(response.result.exipresIn).to.be.match(/\d+/);
      Code.expect(response.result.twoFactor).to.be.match(/true|false/);
      Code.expect(response.result.role).to.be.match(/user|admin/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Me GET', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      request = {
        method: 'GET',
        url: '/api/me',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns Me', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.user).instanceof(Object);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sign Up (Error - I)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/auth'
    };

    done();
  });

  lab.test('it returns Sign Up Response (Error - I)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/must be an object/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sign Up (Error - II)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/auth',
      payload: JSON.stringify({
        fname: ''
      })
    };

    done();
  });

  lab.test('it returns Sign Up Response (Error - II)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your First name/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sign Up (Error - III)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/auth',
      payload: JSON.stringify({
        fname: 'ravi'+time,
        lname: ''
      })
    };

    done();
  });

  lab.test('it returns Sign Up Response (Error - III)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your Last name/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sign Up (Error - IV)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/auth',
      payload: JSON.stringify({
        fname: 'ravi'+time,
        lname: 'mehrotra'+time,
        email: ''
      })
    };

    done();
  });

  lab.test('it returns Sign Up Response (Error - IV)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your correct email/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sign Up (Error - V)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/auth',
      payload: JSON.stringify({
        fname: 'ravi'+time,
        lname: 'mehrotra'+time,
        email: 'ravi'+time+'@allies.co.in',
        mobile: '',
      })
    };

    done();
  });

  lab.test('it returns Sign Up Response (Error - V)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your mobile number/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sign Up (Error - VI)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/auth',
      payload: JSON.stringify({
        fname: 'ravi'+time,
        lname: 'mehrotra'+time,
        email: 'ravi'+time+'@allies.co.in',
        mobile: '+911234567890',
        sponsorid: '',
      })
    };

    done();
  });

  lab.test('it returns Sign Up Response (Error - VI)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please provide your Sponsor Id/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sign Up (Error - VII)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/auth',
      payload: JSON.stringify({
        fname: 'ravi'+time,
        lname: 'mehrotra'+time,
        email: 'ravi'+time+'@allies.co.in',
        mobile: '+911234567890',
        sponsorid: 'bbapp',
        ip: '',
      })
    };

    done();
  });

  lab.test('it returns Sign Up Response (Error - VII)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/not allowed to be empty/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sign Up (Error - VIII)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/auth',
      payload: JSON.stringify({
        fname: 'ravi'+time,
        lname: 'mehrotra'+time,
        email: 'ravi'+time+'@allies.co.in',
        mobile: '+911234567890',
        sponsorid: 'bbapp',
        ip: '127.0.0.1',
        country: '',
      })
    };

    done();
  });

  lab.test('it returns Sign Up Response (Error - VIII)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your country/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sign Up (Error - IX)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/auth',
      payload: JSON.stringify({
        fname: 'ravi'+time,
        lname: 'mehrotra'+time,
        email: 'ravi'+time+'@allies.co.in',
        mobile: '+911234567890',
        sponsorid: 'bbapp',
        ip: '127.0.0.1',
        country: 'india',
        username: '',
      })
    };

    done();
  });

  lab.test('it returns Sign Up Response (Error - IX)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your Username/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sign Up (Error - X)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/auth',
      payload: JSON.stringify({
        fname: 'ravi'+time,
        lname: 'mehrotra'+time,
        email: 'ravi'+time+'@allies.co.in',
        mobile: '+911234567890',
        sponsorid: 'bbapp',
        ip: '127.0.0.1',
        country: 'india',
        username: 'ravimehrotra'+time,
        password: ''
      })
    };

    done();
  });

  lab.test('it returns Sign Up Response (Error - X)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your Password/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sign Up (Error - XI)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/auth',
      payload: JSON.stringify({
        fname: 'ravi'+time,
        lname: 'mehrotra'+time,
        email: 'ravi'+time+'@allies.co.in',
        mobile: '+911234567890',
        sponsorid: 'bbapp',
        ip: '127.0.0.1',
        country: 'india',
        username: 'ravimehrotra1',
        password: 'ravi2681'
      })
    };

    done();
  });

  lab.test('it returns Sign Up Response (Error - XI)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/User email or Username already exits/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sign Up (Error - XII)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/auth',
      payload: JSON.stringify({
        fname: 'ravi'+time,
        lname: 'mehrotra'+time,
        email: 'ravi1@allies.co.in',
        mobile: '+911234567890',
        sponsorid: 'bbapp',
        ip: '127.0.0.1',
        country: 'india',
        username: 'ravimehrotra1',
        password: 'ravi2681'
      })
    };

    done();
  });

  lab.test('it returns Sign Up Response (Error - XII)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/User email or Username already exits/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sign Up', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    affiliateDetails.username = affiliateDetails.username + time;

    request = {
      method: 'POST',
      url: '/auth?__t=1',
      payload: JSON.stringify({
        fname: 'ravi'+time,
        lname: 'mehrotra'+time,
        email: 'ravi'+time+'@allies.co.in',
        mobile: '+911234567890',
        sponsorid: 'bbapp',
        ip: '127.0.0.1',
        country: 'india',
        username: 'ravimehrotra'+time,
        password: 'ravi2681'
      })
    };

    done();
  });

  lab.test('it returns Sign Up Response', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.signup).to.be.match(/Success full/i);
      Code.expect(response.result.token).to.be.match(/(\w+)-(\w+)-(\w+)-(\w+)-(\w+)/);
      Code.expect(response.statusCode).to.equal(200);
      token = response.result.token;
      done();
    });
  });
});


lab.experiment('Sponsor Info (Error - I)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/api/sponsor-info'
    };

    done();
  });

  lab.test('it returns sponsor-info (Error - I)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/must be an object/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sponsor Info (Error - II)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/api/sponsor-info',
      payload: JSON.stringify({
        sponsor: ''
      })
    };

    done();
  });

  lab.test('it returns sponsor-info (Error - II)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/is not allowed/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Sponsor Info (Error - III)', () => {

  lab.beforeEach((done) => {
    let time = (new Date()).getTime();

    request = {
      method: 'POST',
      url: '/api/sponsor-info',
      payload: JSON.stringify({
        sponsor: 'safsafdsjl'
      })
    };

    done();
  });

  lab.test('it returns sponsor-info (Error - III)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Invalid Sponsor User/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


// Temp. Commented the Code
// lab.experiment('Sponsor Info', () => {

//   lab.beforeEach((done) => {
//     let time = (new Date()).getTime();

//     request = {
//       method: 'POST',
//       url: '/api/sponsor-info',
//       payload: JSON.stringify({
//         sponsor: 'ravimehrotra1'
//       })
//     };

//     done();
//   });

//   lab.test('it returns sponsor-info', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(false);
//       Code.expect(response.result.sponsor).instanceof(Object);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Add User (Error - I)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'POST',
//         url: apiPath + 'add-user',
//         headers: {
//           "Authorization": response.result.token
//         }
//       };

//       done();
//     });
//   });

//   lab.test('it returns add-user (Error - I)', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.message).to.be.match(/must be an object/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Add User (Error - II)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'POST',
//         url: apiPath + 'add-user',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           fname: ''
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns add-user (Error - II)', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.message).to.be.match(/Please enter your First name/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Add User (Error - III)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'POST',
//         url: apiPath + 'add-user',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           fname: 'ravi'+time,
//           lname: ''
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns add-user (Error - III)', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.message).to.be.match(/Please enter your Last name/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Add User (Error - IV)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'POST',
//         url: apiPath + 'add-user',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           fname: 'ravi'+time,
//           lname: 'mehrotra'+time,
//           email: ''
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns add-user (Error - IV)', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.message).to.be.match(/Please enter your correct email/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Add User (Error - V)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'POST',
//         url: apiPath + 'add-user',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           fname: 'ravi'+time,
//           lname: 'mehrotra'+time,
//           email: 'ravi'+time+'@allies.co.in',
//           mobile: '',
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns add-user (Error - V)', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.message).to.be.match(/Please enter your mobile number/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Add User (Error - VI)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'POST',
//         url: apiPath + 'add-user',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           fname: 'ravi'+time,
//           lname: 'mehrotra'+time,
//           email: 'ravi'+time+'@allies.co.in',
//           mobile: '+911234567890',
//           sponsorid: ''
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns add-user (Error - VI)', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.message).to.be.match(/Please provide your Sponsor Id/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Add User (Error - VII)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'POST',
//         url: apiPath + 'add-user',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           fname: 'ravi'+time,
//           lname: 'mehrotra'+time,
//           email: 'ravi'+time+'@allies.co.in',
//           mobile: '+911234567890',
//           sponsorid: 'bbapp',
//           ip: '',
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns add-user (Error - VII)', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.message).to.be.match(/is not allowed to be empty/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Add User (Error - VIII)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'POST',
//         url: apiPath + 'add-user',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           fname: 'ravi'+time,
//           lname: 'mehrotra'+time,
//           email: 'ravi'+time+'@allies.co.in',
//           mobile: '+911234567890',
//           sponsorid: 'bbapp',
//           ip: '127.0.0.1',
//           country: '',
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns add-user (Error - VIII)', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.message).to.be.match(/Please enter your country/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Add User (Error - IX)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'POST',
//         url: apiPath + 'add-user',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           fname: 'ravi'+time,
//           lname: 'mehrotra'+time,
//           email: 'ravi'+time+'@allies.co.in',
//           mobile: '+911234567890',
//           sponsorid: 'bbapp',
//           ip: '127.0.0.1',
//           country: 'india',
//           username: ''
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns add-user (Error - IX)', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.message).to.be.match(/Please enter your Username/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Add User (Error - X)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'POST',
//         url: apiPath + 'add-user',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           fname: 'ravi'+time,
//           lname: 'mehrotra'+time,
//           email: 'ravi'+time+'@allies.co.in',
//           mobile: '+911234567890',
//           sponsorid: 'bbapp',
//           ip: '127.0.0.1',
//           country: 'india',
//           username: 'ravimehrotra'+time,
//           password: '',
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns add-user (Error - X)', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.message).to.be.match(/Please enter your Password/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Add User (Error - XI)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'POST',
//         url: apiPath + 'add-user',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           fname: 'ravi'+time,
//           lname: 'mehrotra'+time,
//           email: 'ravi'+time+'@allies.co.in',
//           mobile: '+911234567890',
//           sponsorid: 'bbapp',
//           ip: '127.0.0.1',
//           country: 'india',
//           username: 'ravimehrotra'+time,
//           password: 'ravi2681',
//           position: 'WWWW'
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns add-user (Error - XI)', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.message).to.be.match(/must be one of/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Add User (Error - XII)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'POST',
//         url: apiPath + 'add-user',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           fname: 'ravi'+time,
//           lname: 'mehrotra'+time,
//           email: 'ravi'+time+'@allies.co.in',
//           mobile: '+911234567890',
//           sponsorid: 'bbapp',
//           ip: '127.0.0.1',
//           country: 'india',
//           username: 'ravimehrotra1',
//           password: 'ravi2681',
//           position: 'R'
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns add-user (Error - XII)', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.message).to.be.match(/User email or Username already exits/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Add User (Error - XII)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'POST',
//         url: apiPath + 'add-user',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           fname: 'ravi'+time,
//           lname: 'mehrotra'+time,
//           email: 'ravi1@allies.co.in',
//           mobile: '+911234567890',
//           sponsorid: 'bbapp',
//           ip: '127.0.0.1',
//           country: 'india',
//           username: 'ravimehrotra'+time,
//           password: 'ravi2681',
//           position: 'R'
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns add-user (Error - XII)', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.message).to.be.match(/User email or Username already exits/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Add User', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'POST',
//         url: apiPath + 'add-user',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           fname: 'ravi'+time,
//           lname: 'mehrotra'+time,
//           email: 'ravi'+time+'@allies.co.in',
//           mobile: '+911234567890',
//           sponsorid: 'bbapp',
//           ip: '127.0.0.1',
//           country: 'india',
//           username: 'ravimehrotra'+time,
//           password: 'ravi2681',
//           position: 'L'
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns add-user', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.signup).to.be.match(/Success full/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


lab.experiment('Change Password (Error - I)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: '/api/change-password',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          oldpassword: '',
          password: 'ravi2681',
          confirmpassword: 'ravi2681'
        })
      };

      done();
    });
  });

  lab.test('it returns change-password (Error - I)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your Old Password/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Change Password (Error - II)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: '/api/change-password',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          oldpassword: 'asdfsafd',
          password: 'ravi2681',
          confirmpassword: 'ravi2681'
        })
      };

      done();
    });
  });

  lab.test('it returns change-password (Error - II)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Invalid Old Password/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Change Password (Error - III)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: '/api/change-password',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          oldpassword: 'ravi2681',
          password: '',
          confirmpassword: 'ravi2681'
        })
      };

      done();
    });
  });

  lab.test('it returns change-password (Error - III)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your Password/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Change Password (Error - IV)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: '/api/change-password',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          oldpassword: 'ravi2681',
          password: '',
          confirmpassword: 'ravi2681'
        })
      };

      done();
    });
  });

  lab.test('it returns change-password (Error - IV)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your Password/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Change Password (Error - V)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: '/api/change-password',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          oldpassword: 'web@123',
          password: 'ravi2681!Q',
          confirmpassword: 'ravi2681'
        })
      };

      done();
    });
  });

  lab.test('it returns change-password (Error - V)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Confirm password and password not match/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Change Password (Error - VI)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: '/api/change-password',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          oldpassword: 'web@123',
          password: 'ravi2681',
          confirmpassword: 'ravi2681!Q'
        })
      };

      done();
    });
  });

  lab.test('it returns change-password (Error - VI)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Confirm password and password not match/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Change Password', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: '/api/change-password',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          oldpassword: 'web@123',
          password: 'web@123',
          confirmpassword: 'web@123'
        })
      };

      done();
    });
  });

  lab.test('it returns change-password', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.message).to.be.match(/Change Password/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Profile (Error - I)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: apiPath + 'profile',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          fname: '',
          lname: 'mehrotra89',
          email: 'ravi89@allies.co.in',
          mobile: '+911234567890',
          address: 'The Mall',
          city: 'Kanpur',
          state: 'UP',
          postal: '208001',
          country: 'india'
        })
      };

      done();
    });
  });

  lab.test('it returns Profile (Error - I)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your First name/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Profile (Error - II)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: apiPath + 'profile',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          fname: 'mehrotra89',
          lname: '',
          email: 'ravi89@allies.co.in',
          mobile: '+911234567890',
          address: 'The Mall',
          city: 'Kanpur',
          state: 'UP',
          postal: '208001',
          country: 'india'
        })
      };

      done();
    });
  });

  lab.test('it returns Profile (Error - II)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your Last name/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Profile (Error - III)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: apiPath + 'profile',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          fname: 'mehrotra89',
          lname: 'ravi89@allies.co.in',
          email: '',
          mobile: '+911234567890',
          address: 'The Mall',
          city: 'Kanpur',
          state: 'UP',
          postal: '208001',
          country: 'india'
        })
      };

      done();
    });
  });

  lab.test('it returns Profile (Error - III)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your correct email/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Profile (Error - IV)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: apiPath + 'profile',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          fname: 'ravi89',
          lname: 'mehrotra89',
          email: 'ravi89@allies.co.in',
          mobile: '',
          address: 'The Mall',
          city: 'Kanpur',
          state: 'UP',
          postal: '208001',
          country: 'india'
        })
      };

      done();
    });
  });

  lab.test('it returns Profile (Error - IV)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your mobile number/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Profile (Error - V)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: apiPath + 'profile',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          fname: 'ravi89',
          lname: 'mehrotra89',
          email: 'ravi89@allies.co.in',
          mobile: '+911234567890',
          address: '',
          city: 'Kanpur',
          state: 'UP',
          postal: '208001',
          country: 'india'
        })
      };

      done();
    });
  });

  lab.test('it returns Profile (Error - V)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/is not allowed to be empty/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Profile (Error - VI)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: apiPath + 'profile',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          fname: 'ravi89',
          lname: 'mehrotra89',
          email: 'ravi89@allies.co.in',
          mobile: '+911234567890',
          address: 'The Mall',
          city: '',
          state: 'UP',
          postal: '208001',
          country: 'india'
        })
      };

      done();
    });
  });

  lab.test('it returns Profile (Error - VI)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/is not allowed to be empty/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Profile (Error - VII)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: apiPath + 'profile',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          fname: 'ravi89',
          lname: 'mehrotra89',
          email: 'ravi89@allies.co.in',
          mobile: '+911234567890',
          address: 'The Mall',
          city: 'Kanpur',
          state: '',
          postal: '208001',
          country: 'india'
        })
      };

      done();
    });
  });

  lab.test('it returns Profile (Error - VII)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/is not allowed to be empty/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Profile (Error - VIII)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: apiPath + 'profile',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          fname: 'ravi89',
          lname: 'mehrotra89',
          email: 'ravi89@allies.co.in',
          mobile: '+911234567890',
          address: 'The Mall',
          city: 'Kanpur',
          state: 'UP',
          postal: '',
          country: 'india'
        })
      };

      done();
    });
  });

  lab.test('it returns Profile (Error - VIII)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/is not allowed to be empty/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Profile (Error - IX)', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: apiPath + 'profile',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          fname: 'ravi89',
          lname: 'mehrotra89',
          email: 'ravi89@allies.co.in',
          mobile: '+911234567890',
          address: 'The Mall',
          city: 'Kanpur',
          state: 'UP',
          postal: '208001',
          country: ''
        })
      };

      done();
    });
  });

  lab.test('it returns Profile (Error - IX)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Please enter your country/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Profile', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'POST',
        url: apiPath + 'profile',
        headers: {
          "Authorization": response.result.token
        },
        payload: JSON.stringify({
          fname: 'SREBRENKO',
          lname: 'POSAVEC',
          email: 'srebrni10@gmail.com',
          mobile: '+911234567890',
          address: 'US',
          city: 'US',
          state: 'US',
          postal: '208001',
          country: 'United States'
        })
      };

      done();
    });
  });

  lab.test('it returns Profile', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.message).to.be.match(/User update/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});

// Temp. Comment Out CODE EMAIL SEND
// lab.experiment('Directs', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'GET',
//         url: apiPath + 'directs',
//         headers: {
//           "Authorization": response.result.token
//         }
//       };

//       done();
//     });
//   });

//   lab.test('it returns Directs', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(false);
//       Code.expect(response.result.directs).instanceof(Array);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });

// Temp. Comment Out CODE EMAIL SEND
// lab.experiment('Team Members', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'GET',
//         url: apiPath + 'team-members',
//         headers: {
//           "Authorization": response.result.token
//         }
//       };

//       done();
//     });
//   });

//   lab.test('it returns team-members', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(false);
//       Code.expect(response.result.teamMembers).instanceof(Array);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });

// Temp. Comment Out CODE EMAIL SEND
// lab.experiment('Total Users', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'GET',
//         url: '/api/users/total-users',
//         headers: {
//           "Authorization": response.result.token
//         }
//       };

//       done();
//     });
//   });

//   lab.test('it returns total-users', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(false);
//       Code.expect(response.result.users).instanceof(Array);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


lab.experiment('Verify Email (Error - I)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/verify-email'
    };

    done();
  });

  lab.test('it returns verify-email (Error - I)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/must be an object/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Verify Email (Error - II)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/verify-email',
      payload: JSON.stringify({verify_token: ''})
    };

    done();
  });

  lab.test('it returns verify-email (Error - II)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/is not allowed to be empty/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Verify Email (Error - III)', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/verify-email',
      payload: JSON.stringify({verify_token: 'asdfasdfsadfsd'})
    };

    done();
  });

  lab.test('it returns verify-email (Error - III)', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(true);
      Code.expect(response.result.message).to.be.match(/Invalid Email Verify Token/);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


lab.experiment('Verify Email', () => {

  lab.beforeEach((done) => {
    request = {
      method: 'POST',
      url: '/auth/verify-email',
      payload: JSON.stringify({verify_token: token})
    };

    done();
  });

  lab.test('it returns verify-email', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.message).to.be.match(/Email Verified/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});


// lab.experiment('Affiliates Create GET', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'GET',
//         url: apiPath + 'affiliates',
//         headers: {
//           "Authorization": response.result.token
//         }
//       };

//       done();
//     });
//   });

//   lab.test('it returns Affiliates', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(false);
//       Code.expect(response.result.token).to.be.match(/(\w+)-(\w+)-(\w+)-(\w+)-(\w+)/i);
//       Code.expect(response.statusCode).to.equal(200);
//       tokenAffiliates = response.result.token;
//       done();
//     });
//   });
// });


// lab.experiment('Affiliates Create (Error - I)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/create',
//         headers: {
//           "Authorization": response.result.token
//         }
//       };

//       done();
//     });
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


// lab.experiment('Affiliates Create (Error - II)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/create',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({})
//       };

//       done();
//     });
//   });

//   lab.test('it returns', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/"amount" is required/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Affiliates Create (Error - III)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/create',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           "amount": 25
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/"paymethod" is required/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Affiliates Create (Error - IV)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/create',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           "amount": 100,
//           "paymethod": 'xyz',
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/"paymethod" must be one of \[bitcoin, wallet\]/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Affiliates Create (Error - V)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/create',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           "amount": 100,
//           "paymethod": 'bitcoin',
//           "token": "asdfasdfsadf"
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/"token" must be a valid GUID/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Affiliates Create POST', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/create',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           "amount": 100,
//           "paymethod": 'bitcoin',
//           "token": tokenAffiliates
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns Affiliates Create', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(false);
//       Code.expect(response.result.message).to.be.match(/Affiliate save successfully/i);
//       Code.expect(response.result.affiliates).instanceOf(Object);
//       Code.expect(response.statusCode).to.equal(200);
//       invoiceNo = response.result.affiliates.invoiceNumber;

//       done();
//     });
//   });
// });


// lab.experiment('Affiliates Invoice Hash Update (Error - I)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/invoice/update',
//         headers: {
//           "Authorization": response.result.token
//         }
//       };

//       done();
//     });
//   });

//   lab.test('it returns Affiliates Update', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/"value" must be an object/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Affiliates Invoice Hash Update (Error - II)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/invoice/update',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({})
//       };

//       done();
//     });
//   });

//   lab.test('it returns Affiliates Update', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/"invoiceId" is required/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Affiliates Invoice Hash Update (Error - III)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/invoice/update',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           "invoiceId": "asdfassasdf"
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns Affiliates Update', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/"invoiceId" must be a number/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Affiliates Invoice Hash Update (Error - IV)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/invoice/update',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           "invoiceId": "1231231231",
//           "hash": "asdfasdfasdfasdfasdf"
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns Affiliates Update', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/Invoice not updated/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Affiliates Invoice Hash Update POST', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/invoice/update',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           "invoiceId": invoiceNo,
//           "hash": "sadfasdfasjdlfasjdflasdjflsf"
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns Affiliates Update', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(false);
//       Code.expect(response.result.message).to.be.match(/Invoice updated successfully/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Affiliates Update (Error - I)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/update',
//         headers: {
//           "Authorization": response.result.token
//         }
//       };

//       done();
//     });
//   });

//   lab.test('it returns Affiliates Update', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/"value" must be an object/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Affiliates Update (Error - II)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/update',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({})
//       };

//       done();
//     });
//   });

//   lab.test('it returns Affiliates Update', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/"number" is required/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Affiliates Update (Error - III)', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/update',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           "number": "asdfassafdsa"
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns Affiliates Update', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(true);
//       Code.expect(response.result.message).to.be.match(/Affiliation not update/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


// lab.experiment('Affiliates Update POST', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       request = {
//         method: 'POST',
//         url: apiPath + 'affiliates/update',
//         headers: {
//           "Authorization": response.result.token
//         },
//         payload: JSON.stringify({
//           "number": invoiceNo + ''
//         })
//       };

//       done();
//     });
//   });

//   lab.test('it returns Affiliates Update', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(false);
//       Code.expect(response.result.message).to.be.match(/Affiliation update successfully/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });


lab.experiment('Logout', () => {

  lab.beforeEach((done) => {
    server.inject({method: 'POST', url: '/auth/login', payload: loginDetail}, (response) => {
      let time = (new Date()).getTime();

      request = {
        method: 'GET',
        url: '/api/me/logout',
        headers: {
          "Authorization": response.result.token
        }
      };

      done();
    });
  });

  lab.test('it returns logout', (done) => {
    server.inject(request, (response) => {
      Code.expect(response.result.hasError).equal(false);
      Code.expect(response.result.message).to.be.match(/Successfully logout/i);
      Code.expect(response.statusCode).to.equal(200);

      done();
    });
  });
});



// lab.experiment('Logout Affiliates', () => {

//   lab.beforeEach((done) => {
//     server.inject({method: 'POST', url: '/auth/login', payload: JSON.stringify(affiliateDetails)}, (response) => {
//       let time = (new Date()).getTime();

//       request = {
//         method: 'GET',
//         url: '/api/me/logout',
//         headers: {
//           "Authorization": response.result.token
//         }
//       };

//       done();
//     });
//   });

//   lab.test('it returns logout affiliates', (done) => {
//     server.inject(request, (response) => {
//       Code.expect(response.result.hasError).equal(false);
//       Code.expect(response.result.message).to.be.match(/Successfully logout/i);
//       Code.expect(response.statusCode).to.equal(200);

//       done();
//     });
//   });
// });