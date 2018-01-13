'use strict';

let Joi = require('joi');

class RequestVaildator {

  // Post Validator of Forget Password
  postVaildator() {
    return {
      email: Joi.string().email().required()
    }
  }

  // Post Validator of Change Password
  postChangePasswordValidator() {
    return {
      token: Joi.string().guid().required(),
      password: Joi.string().required(),
      confirmpassword: Joi.string().required()
    }
  }
}

module.exports = new RequestVaildator();