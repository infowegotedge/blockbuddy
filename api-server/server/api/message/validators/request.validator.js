'use strict';

let Joi = require('joi');

class RequestVaildator {

  // Get Post Parameter Validator
  getPostParameter() {
    return {
      "sent_to": Joi.array().required(),
      "subject": Joi.string().required(),
      "message": Joi.string().required()
    };
  }

  // Get Message ID Parameter Validator
  getUsersParameter() {
    return {
      "messageId": Joi.string().required()
    };
  }

  // Get Message ID Parameter Validator
  getMarkReadParameter() {
    return {
      "id": Joi.string().required()
    };
  }
}

module.exports = new RequestVaildator();