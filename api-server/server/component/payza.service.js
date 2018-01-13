'use strict';

// var _         = require('lodash');
// var config    = require('./../../config/environment').payza;
// var apiConfig = require('./../../config/environment').payzaAPIInfo;
const request   = require('request');
const crypto    = require('crypto');

module.exports = function() {

  let config = {
    apMerchant: process.env.PAYZA_APP_MERCHANT,
    apPurchasetype: process.env.PAYZA_APP_PURCHASE_TYPE,
    apItemname: '',
    apAmount: 0,
    apCurrency: process.env.PAYZA_CURRENCY,
    apItemcode: '',
    apDescription: '',
    apReturnurl: process.env.PAYZA_RETURN_URL, // 'http://ravidiziana.com:'+(process.env.PORT || '9000')+'/api/pay/success/return',
    apCancelurl: process.env.PAYZA_CANCEL_URL,  // 'http://ravidiziana.com:'+(process.env.PORT || '9000')+'/api/pay/cancel/return',
    apAlerturl: process.env.PAYZA_ALERT_URL,
    apTaxamount: 0,
    apAdditionalcharges: 0,
    apShippingcharges: 0,
    apDiscountamount: 0,
    apPostURL: process.env.PAYZA_CHECKOUT,
    apPayzaFee: 0.59,
    apPayzaFeeDivision: 0.96,
    apTestmode: process.env.PAYZA_TEST_MODE
  }

  return {

    getPayInfo: function(payAmount, taxAmount, itemName, itemCode) {
      let payConfig  = config;
          payConfig.apItemname    = itemName;
          payConfig.apDescription = itemName;
          payConfig.apItemcode    = itemCode;
          payConfig.apAmount      = payAmount;

      let hashString = payConfig.apMerchant + ':' + payConfig.apPurchasetype + ':' + payAmount + ':' + payConfig.apItemname + ':' + payConfig.apCurrency + ':' + payConfig.apDiscountamount + ':' + taxAmount;

      let hashSHA256 = crypto.createHash('sha256');
      hashSHA256.update(hashString);

      payConfig = JSON.stringify(payConfig);
      payConfig = new Buffer(payConfig, 'ascii');
      return {payConfig: payConfig.toString('base64'), payHash: hashSHA256.digest('hex')};
    },

    getDetails: function(token, callback) {

      ec.get_details({token: token}, callback);
    },

    getIPNInfo: function(token, callback) {

      // Set the headers
      let headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }

      // Configure the request
      let options = {
        url: 'https://secure.payza.com/ipn2.ashx',
        method: 'POST',
        headers: headers,
        form: {
          'token': token
        }
      };

      request(options, (err, httpRequest) => {

        if(err) {
          return callback(err, null);
        }

        let data = unescape(httpRequest.body),
            processedInfo = {};

        data = (data.split('&') || []);

        data.forEach((info) => {
          let _info = info.split('=');
          processedInfo[_info[0]+''] = unescape(_info[1]);
        });

        return callback(null, processedInfo);
      });
    },

    validatePayment: function(data, payments) {
      let payConfig  = config;
      let isValid    = false;
      let parsedInfo = data;

      if(parsedInfo && parsedInfo['ap_merchant'] == payConfig.apMerchant) {
        let amount     = (parseFloat(data.ap_amount) + parseFloat(data.ap_additionalcharges)).toFixed(2);
        let hashString = data.ap_merchant + ':' + data.ap_purchasetype + ':' + amount + ':' + data.ap_itemname.replace(/\+/g, ' ') + ':' + data.ap_currency + ':' + data.ap_discountamount + ':' + data.ap_additionalcharges;

        let hashSHA256 = crypto.createHash('sha256');
        hashSHA256.update(hashString);
        let dataHash = hashSHA256.digest('hex');

        isValid = ((dataHash == payments.paymentHash) && (parseInt(payConfig.apDiscountamount) == parseInt(data.ap_discountamount)));
      }

      return isValid;
    },

    sendMoney: function(receiver, amount, transferNote, callback) {

      // Set the headers
      let headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }

      // Configure the request
      let options = {
        url: process.env.PAYZA_API_URL,
        method: 'POST',
        headers: headers,
        form: {
          "USER": process.env.PAYZA_USER,
          "PASSWORD": process.env.PAYZA_PASS,
          "AMOUNT": amount,
          "CURRENCY": process.env.PAYZA_CURRENCY,
          "RECEIVEREMAIL": receiver,
          "SENDEREMAIL": process.env.PAYZA_USER,
          "PURCHASETYPE": process.env.PAYZA_PURCHASE_TYPE,
          "NOTE": transferNote,
          "TESTMODE": process.env.PAYZA_TEST_MODE
        }
      };

      request(options, function (err, httpRequest) {

        if(err) {
          return callback(err, null);
        }

        let data = (httpRequest.body.split('&') || []),
            processedInfo = {};
        data.forEach(function(info) {
          let _info = info.split('=');
          processedInfo[_info[0]+''] = unescape(_info[1]);
        });

        callback(null, processedInfo);
      });
    }
  };

};
