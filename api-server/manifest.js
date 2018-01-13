'use strict';

const Confidence = require('confidence');
const Config = require('./config');


const criteria = {
  env: process.env.NODE_ENV
};

const manifest = {
  $meta: 'BlockBuddy APP Service',
  server: {
    debug: {
      request: ['error'],
      log: ['error']
    },
    connections: {
      routes: {
        security: true,
        cors: {
          origin: (process.env.ALLOW_ORIGIN + ',' + process.env.CAMPAIGN_DOMAIN).split(','),
          additionalHeaders: ['cache-control', 'x-requested-with', 'authorization', 'traderauth'],
          credentials: true
        }
      }
    }
  },
  connections: [{
    port: Config.get('/port/api'),
    labels: ['api']
  }],
  registrations: [
    {
      plugin: {
        register: 'bell'
      }
    },
    {
      plugin: {
        register: 'hapi-auth-jwt2'
      }
    }, {
      plugin: {
        register: './server/plugins/sign-jwt/sign-jwt'
      }
    },
    {
      plugin: {
        register: 'hapi-mongoose',
        options: {
          bluebird: true,
          uri: 'mongodb://'+process.env.MONGOOSE_DB_PATH+'/'+process.env.MONGOOSE_DB
        }
      }
    },
    {
      plugin: {
        register: 'good',
        options: {
          ops: {
            interval: 1000
          },
          reporters: {
            myConsoleReporter: [{
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{ log: '*', response: '*' }]
            }, {
              module: 'good-console'
            }, 'stdout'],
            myFileReporter: [{
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{ ops: '*' }]
            }, {
              module: 'good-squeeze',
              name: 'SafeJson'
            }, {
              module: 'good-file',
              args: ['./test/fixtures/awesome_log']
            }],
            myHTTPReporter: [{
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{ error: '*' }]
            }, {
              module: 'good-http',
              args: ['http://prod.logs:3000', {
                wreck: {
                  headers: { 'x-api-key': 12345 }
                }
              }]
            }]
          }
        }
      }
    }
  ]
};


const store = new Confidence.Store(manifest);


exports.get = function (key) {

  return store.get(key, criteria);
};


exports.meta = function (key) {

  return store.meta(key, criteria);
};
