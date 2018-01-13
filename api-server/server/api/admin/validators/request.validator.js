'use strict';

let Joi = require('joi');

class RequestVaildator {

  // Get Setting Parameter Validator
  getSettingsParameter() {
    return {
      "cutOffValue": Joi.number(),
      "affiliationFee": Joi.number(),
      "affiliationAmount": Joi.number(),
      "withdrawalFee": Joi.number(),
      "withdrawalAutoLimit": Joi.number(),
      "withdrawalMinLimit": Joi.number(),
      "withdrawalMaxLimit": Joi.number(),
      "transferFee": Joi.number(),
      "transferPerUserDayLimit": Joi.number(),
      "transferCoinPerUserDayLimit": Joi.number(),
      "mailChimpKey": Joi.string(),
      "mailChimpList": Joi.string(),
      "mailChimpEmail": Joi.string(),
      "mailChimpFromName": Joi.string(),
      "enableDisable": Joi.number().min(1).max(1)
    };
  }

  // Get Upload Parameter Validator
  getUploadParameter() {
    return {
      output: 'file',
      maxBytes: 5242880,
      parse: true
    };
  }

  // Get Withdrawal List Parameter Validator
  getWithdrawalsQueryParameter() {
    return {
      "auto_withdraw": Joi.boolean(),
      "status": Joi.string(),
      "user_id": Joi.string(),
      "page": Joi.number(),
      "type": Joi.string(),
    }
  }

  // Get Transfer List Parameter Validator
  getTransfersQueryParameter() {
    return {
      "page": Joi.number(),
      "user_id": Joi.string()
    }
  }

  // Get Affiliation List Parameter Validator
  getCommissionQueryParameter() {
    return {
      "page": Joi.number(),
      "from": Joi.date(),
      "upto": Joi.date().max('now')
    }
  }

  // Get Fee Withdrawal Query Parameter Validator
  getWithdrawalQueryParameter() {
    return {
      "page": Joi.number(),
      "from": Joi.date(),
      "upto": Joi.date().max('now')
    }
  }

  // Get Fee Transfer Query Parameter Validator
  getTransferQueryParameter() {
    return {
      "page": Joi.number(),
      "from": Joi.date(),
      "upto": Joi.date().max('now')
    }
  }

  // Get User Update Parameter Validator
  getUserUpdateParameter() {
    return {
      username: Joi.string().max(30).required(),
      user_id: Joi.string().required(),
      fname: Joi.string().max(25).required(),
      lname: Joi.string().max(25).required(),
      email: Joi.string().email().required(),
      mobile: Joi.string().min(10).max(13).required(),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      postal: Joi.string(),
      country: Joi.string().required(),
      password: Joi.string()
    }
  }

  // Get Block User Parameter Validator
  getUserBlockParameter() {
    return {
      user_id: Joi.string().required(),
      block_user: Joi.boolean().required()
    }
  }

  // Get Affiliate List Parameter Validator
  getAffiliatesParameter() {
    return {
      "page": Joi.number(),
      "from": Joi.date(),
      "upto": Joi.date().max('now'),
      "status": Joi.string()
    }
  }

  // Get Affiliate Update Parameter Validator
  getAffiliatesUpdateParameter() {
    return {
      "id": Joi.number().required(),
      "status": Joi.string().required()
    }
  }

  // Get User Switch Parameter Validator
  getLoginAsUserParameter() {
    return {
      "username": Joi.string().required()
    }
  }

  // Get User Role Parameter Validator
  getUserRolesParameter() {
    return {
      role: Joi.string().required(),
      category: Joi.string().required(),
      permission: Joi.array().required(),
      userId: Joi.string().required()
    }
  }

  // Create Currency Parameters
  getCreateCurrencyParameter() {
    return {
      currency: Joi.string().required(),
      code: Joi.string().required(),
    }
  }

  // Create Coins Parameters
  getCreateCoinsParameter() {
    return {
      coinName: Joi.string().required(),
      coinCode: Joi.string().required(),
      coinValue: Joi.number().required()
    }
  }

  // Create Coins Parameters
  getCreateCommissionParameter() {
    return {
      commission: Joi.number().required(),
      level_number: Joi.number().required(),
      commission_type: Joi.string().required()
    }
  }

  // Create Coins Parameters
  getUpdateCommissionParameter() {
    return {
      commission: Joi.number().required(),
      commission_id: Joi.string().required(),
      commission_type: Joi.string().required()
    }
  }

  // Delete Commission Parameters
  getDeleteCommissionParameter() {
    return {
      id: Joi.string().required()
    }
  }

  // Delete Product Parameters
  getDeleteProductParameter() {
    return {
      id: Joi.string().required()
    }
  }

  getWithdrawApprovedRejectParameter() {
    return {
      amount: Joi.number().required(),
      status: Joi.string().required(),
      admin_comments: Joi.string().required(),
      id: Joi.string().required()
    }
  }

  postBroadCastNotification() {
    return {
      message: Joi.string().required()
    }
  }

  updateBroadCastNotification() {
    return {
      messageId: Joi.string().required()
    }
  }

  postCMSContent() {
    return {
      heading: Joi.string().required(),
      content: Joi.string().required(),
      photo: Joi.string().required()
    }
  }

  putCMSContent() {
    return {
      id: Joi.string().required(),
      heading: Joi.string().required(),
      content: Joi.string().required(),
      photo: Joi.string().required()
    }
  }

  deactivateCMSContent() {
    return {
      id: Joi.string().required()
    }
  }
}

module.exports = new RequestVaildator();