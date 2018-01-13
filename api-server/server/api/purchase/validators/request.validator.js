'use strict';

let Joi = require('joi');

class RequestVaildator {

  // Get Purchase Paramter 
  getPurchaseRequset() {
    return {
      "name": Joi.string().min(4).required(),
      "quantity": Joi.string().min(1).required(),
      "price": Joi.number().min(100).required(),
      "token": Joi.string().required()
    }
  }

  // Get Current Rates Paramter
  getCurrentRates() {
    return {
      "unit": Joi.string().min(3).required(),
      "price_btc": Joi.number().max(1).required(),
      "price_usd": Joi.number().max(1).required()
    }
  }

  // Get Payments Paramter Validator
  getPaymentRequest() {
    return {
      "purchase": Joi.string().min(24).required(),
      "payment_method": Joi.number().min(1).max(10).required()
    }
  }

  // Get Product Paramter
  getProductRequest() {
    return {
      "name": Joi.string().required(),
      "value": Joi.number().min(0).max(10).required(),
      "currency_code": Joi.string().required(),
      "product_type": Joi.any().valid(['MONTHLY_SUBSCRIPTIONS', 'NORMAL']),
      "product_belongs": Joi.any().valid(['MEMBERSHIP_LEVELS', 'OTHERS']),
      "amount": Joi.number().min(0).required(),
      "shares": Joi.number().min(0),
      "after_three_month": Joi.number().min(0),
      "after_three_month_string": Joi.string(),
      "can_trade": Joi.boolean(),
      "receive_affiliate_commissions": Joi.boolean(),
      "receive_20p_points_monthly_shares_block_evolution_shares": Joi.boolean(),
      "receive_coins_from_index_buying": Joi.boolean(),
      "receive_coins_from_the_social_commerce_pool": Joi.boolean(),
      "receive_50p_points_in_monthly_shares_block_evolution_shares": Joi.boolean(),
      "includes_yazzer_membership_including_jet_and_yacht_points": Joi.boolean(),
      "receive_coins_from_index_buying_convert_yazzer": Joi.boolean(),
      "receive_coins_from_the_social_commerce_pool_convert_yazzer": Joi.boolean(),
      "receive_100p_points_monthly_shares_block_evolution_shares": Joi.boolean()
    }
  }

  getPurchaseOrderRequest() {
    return {
      "order_id": Joi.string().required()
    }
  }
}

module.exports = new RequestVaildator();