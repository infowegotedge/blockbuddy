'use strict';

let Joi = require('joi');

class RequestVaildator {

  // Get KYC List Request
  getKycGetParameter() {
    return {
      type: Joi.string().required(),
      page: Joi.number().min(1),
      limit: Joi.number().min(10),
      filter: Joi.string()
    }
  }

  getKycCreateParameter() {
    return {
      "photoId": Joi.string(),
      "taxPhotoId": Joi.string(),
      "governmentId": Joi.string(),
      "taxId": Joi.string()
    }
  }
}

module.exports = new RequestVaildator();