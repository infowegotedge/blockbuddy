'use strict';

const SignJWT = require('./../../../component/sign_jwt');

const AuthValidator = function (decoded, request, callback) {
  return callback(null, (decoded.id && decoded.email));
};

module.exports = AuthValidator;
