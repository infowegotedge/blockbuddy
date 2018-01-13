'use strict';

var Boom      = require('boom');
const JWT     = require('jsonwebtoken');
const SignJWT = require('./../../component/sign_jwt');
let internals = {};

exports.register = function (server, options, next) {
  server.auth.scheme('sign-jwt', internals.implementation);
  return next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};

internals.isFunction = function (functionToCheck) {
  var getType = {};

  return functionToCheck
    && getType.toString.call(functionToCheck) === '[object Function]';
};

internals.isArray = function (variable) {
  var getType = {};

  return variable
    && getType.toString.call(variable) === '[object Array]';
};

internals.implementation = function (server, options) {
  // allow custom error raising or default to Boom if no errorFunc is defined
  function raiseError (errorType, message, scheme, attributes) {
    var errorContext = {
      errorType: errorType,
      message: message,
      scheme: scheme,
      attributes: attributes
    };
    var _errorType = errorType;   // copies of params
    var _message = message;       // so we can over-write them below
    var _scheme = scheme;         // without a linter warning
    var _attributes = attributes; // if you know a better way please PR!

    if (options.errorFunc && internals.isFunction(options.errorFunc)) {
      errorContext = options.errorFunc(errorContext);

      if (errorContext) {
        _errorType = errorContext.errorType;
        _message = errorContext.message;
        _scheme = errorContext.scheme;
        _attributes = errorContext.attributes;
      }
    }

    return Boom[_errorType](_message, _scheme, _attributes);
  }

  return {
    authenticate: function (request, reply) {
      let decoded     = null;
      let headers     = request.headers;
      let verifyToken = request.server.settings.app.verifytoken;
      let tokenType   = options.tokenType || 'Token';
      let token       = (headers['authorization'] || headers['authorization'] || '');
          token       = (token ? token.replace(/Bearer/gi, '').replace(/ /g, '') : null);

      if(!token) {
        console.log('>>>>>>>>>>>>>>> 34', token);
        return reply(raiseError('unauthorized', null, tokenType));
      }

      verifyToken.findByToken(token, function(e, t) {

        if(e || t === 0) {
          console.log('>>>>>>>>>>>> 33', e, t);
          return reply(raiseError('unauthorized',
                        'Invalid token', tokenType), null, { credentials: null });
        }

        token   = t;
        decoded = SignJWT.decode(token, request);

        console.log('>>>>>>>>>> 32', decoded)
        if(decoded === false) {
          return reply(raiseError('unauthorized', 'Invalid token format', tokenType));
        }

        if (options.key && typeof options.validateFunc === 'function') {
          // if keyFunc is function allow dynamic key lookup: https://git.io/vXjvY
          let keyFunc = (internals.isFunction(options.key))
          ? options.key : function (decoded_token, callback) {
            return callback(null, options.key);
          };

          keyFunc(decoded, function (err, key, extraInfo) {
            var verifyOptions = options.verifyOptions || {};
            var keys = (internals.isArray(key)) ? key : [key];
            var keysTried = 0;

            if (err) {
              return reply(raiseError('wrap', err));
            }
            if (extraInfo) {
              request.plugins[pkg.name] = { extraInfo: extraInfo };
            }

            keys.some(function (k) { // itterate through one or more JWT keys
              // JWT.verify(token, k, verifyOptions,
              JWT.verify(decoded, k, verifyOptions,
                function (verify_err, verify_decoded) {
                  if (verify_err) {
                    keysTried++;
                    if (keysTried >= keys.length) {
                      console.log('>>>>>>>>>>>> 31', verify_err, verify_decoded, keysTried, keys.length)
                      return reply(raiseError('unauthorized',
                        'Invalid token', tokenType), null, { credentials: null });
                    }
                    // There are still other keys that might work

                    // return false;
                  } else { // see: http://hapijs.com/tutorials/auth for validateFunc signature
                    return options.validateFunc(verify_decoded, request,
                      function (validate_err, valid, credentials) { // bring your own checks
                        if (validate_err) {
                          return reply(raiseError('wrap', validate_err));
                        }
                        if (!valid) {
                          console.log('>>>>>> 3', valid);
                          reply(raiseError('unauthorized',
                            'Invalid credentials', tokenType), null,
                            { credentials: credentials || verify_decoded });
                        } else {
                          reply.continue({
                            credentials: credentials || verify_decoded,
                            artifacts: token
                          });
                        }

                        return false;
                      });
                  }

                  return false;
                });

              return false;
            });

            return true;
          }); // END keyFunc
          console.log('>>>>>>>>', '2');
        } else { // see: https://github.com/dwyl/hapi-auth-jwt2/issues/130
          return options.verifyFunc(decoded, request,
            function (verify_error, valid, credentials) {
              console.log('>>>>>>>>>> 1', verify_error, valid, credentials);
              if (verify_error) {
                return reply(raiseError('wrap', verify_error));
              }
              if (!valid) {
                console.log('>>>>>>>> 2', valid);
                reply(raiseError('unauthorized', 'Invalid credentials',
                tokenType), null, { credentials: decoded });
              } else {
                reply.continue({
                  credentials: credentials || decoded,
                  artifacts: token
                });
              }

              return true;
            });
        }

        return true;
      });
    }
  }
}