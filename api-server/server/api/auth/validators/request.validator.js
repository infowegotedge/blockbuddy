'use strict';

let Joi = require('joi');

/**
 * Request Validator Class
 */
class RequestVaildator {

  // Get Token Validator
  getTokenParameterValidator() {
    return {
      token: Joi.string().required()
    }
  }

  // Get Directs Query Validator
  getDirectsQueryParameter() {
    return {
      page: Joi.number().min(1),
      limit: Joi.number().min(10),
      email: Joi.string().email()
    }
  }

  // Get Team Member Validator Query
  getTeamMemberQueryParameter() {
    return this.getDirectsQueryParameter()
  }

  // Get Login Validator
  getLoginParameter() {
    return {
      username: Joi.string().min(4).max(35).required(),
      password: Joi.string().min(6).required()
    }
  }

  // Change Password Parameter Validator
  getChangePasswordParameter() {
    return {
      oldpassword: Joi.string().min(6).max(12).required(),
      password: Joi.string().min(6).max(12).required(),
      confirmpassword: Joi.string().min(6).required()
    }
  }

  // Signup Parameter Validator
  getSignupParameter() {
    return {
      fname: Joi.string().max(25).required(),
      lname: Joi.string().max(25).required(),
      email: Joi.string().email().required(),
      mobile: Joi.string().min(6).max(15).required(),
      sponsorid: Joi.string().max(35).required(),
      ip: Joi.string().ip(),
      country: Joi.string().required(),
      username: Joi.string().regex(/^[a-z0-9\_-]+$/).min(6).max(35).required(),
      password: Joi.string().min(6).required(),
      campaignid: Joi.string(),
      bannerid: Joi.string()
    }
  }

  // Add User Parameter Validator
  getAddUserParameter() {
    let addUser = this.getSignupParameter();
    addUser.position = Joi.string().max(1).valid('L', 'R').required();
    return addUser;
  }

  // Profile Parameter Validator
  getPofileParameter() {
    return {
      fname: Joi.string().max(25).required(),
      lname: Joi.string().max(25).required(),
      email: Joi.string().email().required(),
      mobile: Joi.string().min(10).max(13).required(),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      postal: Joi.string(),
      country: Joi.string().required()
    }
  }

  // Sponsor Parameter Validator
  getQueryParameter() {
    return {
      sponsor: Joi.string().required()
    }
  }

  // Email Parameter Validator
  getEmailParameter() {
    return {
      verify_token: Joi.string().required()
    }
  }

  // Verify 2FA Parameter Validator
  getVerify2FAParameter() {
    return {
      key: Joi.string().required(),
      token_key: Joi.string().required(),
      token: Joi.number().required(),
      verifyBy: Joi.string().valid('GOOGLE', 'AUTHY').required()
    }
  }

  // Forget 2FA Parameter Validator
  getForget2FAParameter() {
    return {
      key: Joi.string().required(),
      token_key: Joi.string().required(),
      verifyBy: Joi.string().valid('GOOGLE', 'AUTHY').required()
    }
  }

  getLoginOrSignUpParameter() {
    return {
      id: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      provider: Joi.string().required(),
      image: Joi.string().required(),
      sponsorid: Joi.string().required()
    }
  }
}

module.exports = new RequestVaildator();