'use strict';

let Joi = require('joi');

class RequestVaildator {

  // Get Query Parameter
  getQueryParameters() {
    return {
      username: Joi.string(),
      page: Joi.number()
    };
  }

  // Get User Position Parameter
  getUserPositionParameter() {
    return {
      position: Joi.string().valid('L', 'R', 'BOTH', 'WEAK').required()
    }
  }

  // Get Enable 2FA Parameter
  getEnable2FAParameter() {
    return {
      verifyBy: Joi.string().valid('GOOGLE', 'AUTHY').required(),
      countryCode: Joi.string().when('verifyBy', {'is': 'AUTHY', 'then': Joi.required()}),
      mobileNumber: Joi.string().when('verifyBy', {'is': 'AUTHY', 'then': Joi.required()})
    }
  }

  // Get 2FA Parameter
  get2FAParameter() {
    return {
      key: Joi.string().required(),
      token: Joi.number().required(),
      verifyBy: Joi.string().valid('GOOGLE', 'AUTHY').required()
    }
  }

  // Get Disable 2FA Parameter
  getDisable2FAParameter() {
    return {
      token: Joi.number().required(),
    }
  }
}

module.exports = new RequestVaildator();