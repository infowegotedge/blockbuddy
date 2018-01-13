'use strict';

let Joi = require('joi');

class RequestVaildator {

  getPostParameter() {
    return {
      btcaddress: Joi.string().required()
    }
  }

  getWithdrawalParameter() {
    return {
      amount: Joi.number().min(0).required(),
      token: Joi.string().guid().required(),
      verifyToken: Joi.number()
    }
  }
  
  getTransferParameter() {
    return {
      amount: Joi.number().min(1).required(),
      userid: Joi.string().required(),
      token: Joi.string().guid().required(),
      verifyToken: Joi.number(),
      transferForm: Joi.string().required()
    }
  }
}

module.exports = new RequestVaildator();