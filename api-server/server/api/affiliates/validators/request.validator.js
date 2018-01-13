'use strict';

let Joi = require('joi');

class RequestVaildator {

  // Get Post Paramter Validator
  getPostParameter() {
    return {
      "amount": Joi.number().required(),
      "paymethod": Joi.any().valid(['bitcoin', 'wallet']).required(),
      "token": Joi.string().guid().required()
    };
  }

  // Get Update Paramter Validator
  getUpdateParameter() {
    return {
      "number": Joi.string().required()
    };
  }

  // Get Post Paramter Validator
  getPostHashParameter() {
    return {
      "invoiceId": Joi.number().required(),
      "hash": Joi.string().required()
    };
  }
}

module.exports = new RequestVaildator();