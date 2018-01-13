'use strict';

const Mailchimp = require('mailchimp-api-v3');

class EmailService {

  /**
   * Constructor
   * @param {Object} settings 
   */
  constructor(settings) {
    this.MailChimp = new Mailchimp(settings.mail_chimp_key);
    this.listNo    = settings.mail_chimp_list;
    this.emailFrom = settings.mail_chimp_email;
    this.emailName = settings.mail_chimp_from_name;
  }

  /**
   * Send Message
   * @param {String} campaignId
   * @param {callback} cb
   */
  sentMessage(campaignId, cb) {
    let that = this;

    this.MailChimp.post('/campaigns/'+campaignId+'/actions/send', {})
    .then(function(results) {

      return cb(false, 'Email sent successfully.')

    }).catch(function(err) {
      console.log('Error: in message sending.', err);
      return cb(true, 'Error: in message sending.');
    });
  }

  /**
   * Create Campaign Message
   * @param {String} campaignId
   * @param {Object} object
   * @param {callback} cb
   */
  createCampaignMessage(campaignId, object, cb) {
    let that = this;

    that.MailChimp.put('/campaigns/'+campaignId+'/content', {
      "plain_text": object.message,
      "html": object.message
    }).then(function(results) {
      // return that.sentMessage(campaignId, object);
      return cb(false, campaignId);
    }).catch(function(err) {
      console.log('Email not found', err);
      return cb(true, 'Email not found');
    })
  }

  /**
   * Create Campaign
   * @param {String} resultId
   * @param {Object} object
   * @param {callback} cb
   */
  createCampaign(resultsId, object, cb) {
    let that = this;

    that.MailChimp.post('/campaigns', {
      "type": "regular",
      "recipients": {
        "list_id": this.listNo,
        "segment_opts": {
          "saved_segment_id": resultsId
        }
      },
      "settings": {
        "subject_line": object.subject,
        "from_name": this.emailName,
        "reply_to": this.emailFrom
      }
    }).then(function(results) {
      
      // Create Campaign Message
      return that.createCampaignMessage(results.id, object, cb);

    }).catch(function(err) {
      console.log('Email not found', err);
      return cb(true, 'Email not found');
    });
  }

  /**
   * Create Segments
   * @param {Object} object
   * @param {callback} cb
   */
  createSegments(object, cb) {
    let that  = this;

    that.MailChimp.post('/lists/'+this.listNo+'/segments', {
      "name": 'user-segment-' + (new Date()).getTime(),
      "static_segment": [object.sendTo]
    }).then(function(results) {

      // Create Campaign From List
      return that.createCampaign(results.id, object, cb);

    }).catch(function (err) {
      console.log('Email not found', err);
      return cb(true, 'Email not found');
    });
  }

  /**
   * Process Email
   * @param {Object} serviceObj
   * @param {callback} cb
   */
  processEmail(serviceObj, cb) {
    let that = this;
    let path = '/lists/'+this.listNo+'/members/'
    let body = {
      'email_address': serviceObj.sendTo,
      'status': 'subscribed'
    };
    
    that.MailChimp.post(path, body).then(function(results) {
      // Create Segment From List
      return that.createSegments(serviceObj, cb);
    }).catch(function(err) {
      if(err.title && err.title.toLowerCase() === 'member exists') {
        return that.createSegments(serviceObj, cb);
      }
      else {
        console.log('Email not found', err);
        return cb(true, 'Email not found');
      }
    });
  }
}

module.exports = EmailService;