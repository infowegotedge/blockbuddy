'use strict';

const request = require('request');
const crypto  = require('crypto');
const http    = require('http');

class ExpayAPI {

  // constructor(apiKey, apiSecret, accountAddress) {
  constructor() {
    this.key    = process.env.EXPAY_AUTH_KEY;
    this.secret = process.env.EXPAY_AUTH_SECRET;
    this.apiUrl = process.env.EXPAY_AUTH_URL;
  }

  createHash(stringHash) {
    let hmac = crypto.createHmac('sha1', this.secret);
        hmac.update(stringHash);
    
    return hmac.digest('hex'); 
  }

  doPost(postData, cb) {
    let serviceId = process.env.EXPAY_AUTH_PAYMENT_TYPE;
    let dateTime  = Math.ceil((new Date()).getTime() / 1000);
    let option    = 'initPayment?service_id='+serviceId+'&amount='+postData['amount'].toFixed(2)+'&order='+postData['order_id']+'&key='+this.key+'&timestamp='+dateTime;
    let hashStr   = this.createHash(option);
    option = option + '&hash=' + hashStr;

    let formData = {
      "service_id": serviceId,
      "amount": postData['amount'].toFixed(2),
      "order": postData['order_id'],
      "key": this.key,
      "timestamp": dateTime,
      "hash": hashStr
    };

    let option1 = {url: this.apiUrl + 'initPayment', "form": formData};
    let postRequest = request.post(option1, function(e, httpRequest, body) {
      return cb(e, body);
    });
  }

  getTransaction(postData, cb) {
    let serviceId = process.env.EXPAY_AUTH_PAYMENT_TYPE;
    let dateTime  = Math.ceil((new Date()).getTime() / 1000);
    let option    = 'getStatus?payment_id='+postData.pid+'&key='+this.key+'&timestamp='+dateTime;
    let hashStr   = this.createHash(option);

    let formData = {
      "payment_id": postData.pid,
      "key": this.key,
      "timestamp": dateTime,
      "hash": hashStr
    };

    let option1 = {url: this.apiUrl + 'getStatus', "form": formData};
    let postRequest = request.post(option1, function(e, httpRequest, body) {
      return cb(e, JSON.parse(body));
    });
  }
}

module.exports = ExpayAPI;