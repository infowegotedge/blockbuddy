'use strict';

const EmailService = require('./email-service');
let fs             = require('fs');
const APPPATH      = __dirname;

class EmailNotification {

  // constructor 
  constructor(settings) {
    this.EmailService = new EmailService(settings);
  }

  /**
   * Send Email
   * @param {Object} userObject 
   * @param {String} sendTo 
   * @param {String} subject 
   * @param {String} message 
   * @param {String} sendCC 
   * @param {String} sendBCC 
   * @param {String} verifyLink 
   * @param {callback} cb 
   */
  sendMail(userObject, sendTo, subject, message, sendCC, sendBCC, verifyLink, cb) {
    let that    = this;
    let service = {
      "sendTo": sendTo,
      "subject": subject,
      "message": '',
      "sendCC": sendCC,
      "sendBCC": sendBCC
    };

    try {
      return fs.readFile(APPPATH + message, (err, data) => {
        if (err) return cb(true, 'Email Template Not Found.');
        let messageText   = '';
        let emailTemplate = data.toString('ascii');
            emailTemplate = emailTemplate.replace('USER_FIRST_NAME', userObject.fname);
            emailTemplate = emailTemplate.replace('USER_LAST_NAME', userObject.lname);
            emailTemplate = emailTemplate.replace(/APP_EMAIL_LINK/g, process.env.APP_VERIFY_EMAIL_URL);
            emailTemplate = emailTemplate.replace(/APP_RESET_EMAIL_LINK/g, process.env.APP_RESET_EMAIL_URL);
            emailTemplate = emailTemplate.replace(/EMAIL_LINK_TEXT/g, (typeof verifyLink == 'string' ? verifyLink : verifyLink.validtoken));
            emailTemplate = emailTemplate.replace(/AWS_PATH/g, process.env.AWS_PATH);
            emailTemplate = emailTemplate.replace(/PRODUCT_AMOUNT/g, (verifyLink.payment ? verifyLink.payment.amount.toFixed(2) : ''));
            emailTemplate = emailTemplate.replace(/AMOUNT_WITHDRAW/g, verifyLink.amount_withdrawal);
            emailTemplate = emailTemplate.replace(/AMOUNT/g, verifyLink.amount_transfer);
            emailTemplate = emailTemplate.replace(/USER_NAME/g, verifyLink.userName);
            emailTemplate = emailTemplate.replace(/BTC_ACCOUNT/g, verifyLink.btc_address);
            emailTemplate = emailTemplate.replace(/PRODUCT_TYPE/g, verifyLink.productName);
            emailTemplate = emailTemplate.replace(/PRODUCT_CURRENCY/g, verifyLink.productCurrency);
            emailTemplate = emailTemplate.replace(/ORDER_ID/g, (verifyLink.payment ? verifyLink.payment.order_id : ''));
            emailTemplate = emailTemplate.replace(/PRODUCT_NAME/g, (verifyLink.payment ? verifyLink.payment.product_name : ''));
            emailTemplate = emailTemplate.replace(/PRODUCT_PRICE/g, (verifyLink.payment ? verifyLink.payment.price.toFixed(2) : ''));
            emailTemplate = emailTemplate.replace(/USER_FULL_NAME/g, (verifyLink.fullname ? verifyLink.fullname : ''));
            emailTemplate = emailTemplate.replace(/USER_USERNAME/g, (verifyLink.username ? verifyLink.username : ''));

        if(verifyLink.status) {
          if(verifyLink.status === 'Success') {
            messageText = 'Your Order ' + verifyLink.payment.order_id + ' is completed successfully. <br/>Order details are given below: '
          }
          else if(verifyLink.status === 'Failure') {
            messageText = 'Your Order ' + verifyLink.payment.order_id + ' is failed. <br/>Order details are given below: '
          }
        }

        emailTemplate = emailTemplate.replace(/PURCHASE_MESSAGE_TEXT/g, messageText);
        service.message = emailTemplate;
        
        return that.EmailService.processEmail(service, (e, campaignId) => {
          if(!e) {

            that.EmailService.sentMessage(campaignId, (e, r) => {
              if(!e) {
                return cb(false, 'Email is sent successfully.');
              }

              return cb(true, 'Email not send.');  
            })
          }
          else {
            return cb(true, 'Email not send.');
          }
        });
      });
    }
    catch(e) {
      console.log(e);
      return cb(true, 'Unable to send message');
    }
  }
}

module.exports = EmailNotification;