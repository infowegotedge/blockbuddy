'use strict';

const Messages   = require('../server/api/message/model/messages.model');
const Users      = require('../server/api/auth/model/users.model');
const Tasks      = require('../server/api/tasks/model/tasks.model');
const TaskServer = require('../tasks.server');
const Mailchimp  = require('mailchimp-api-v3');
const Settings   = require('../server/api/admin/model/settings.model');

class MessageTask {

  constructor(server) {
    this.message      = new Messages(server['plugins']['hapi-mongoose']);
    this.users        = new Users(server['plugins']['hapi-mongoose']);
    this.settings     = new Settings(server['plugins']['hapi-mongoose']);
    this.MailChimp    = null;
    this.mailChimpObj = null;
  }

  getMessage(cb) {
    return this.message.findMessage(cb);
  }

  sentMessage(campaignId, object) {
    let that = this;

    this.MailChimp.post('/campaigns/'+campaignId+'/actions/send', {})
    .then(function(results) {

      return that.message.updateMessageStatus(object.id, function(e, r) {
        console.log('Message Sent Successfully.');
        process.exit(0);
      })

    }).catch(function(err) {
      console.log('Error: in message sending.');
      process.exit(0);
    });
  }

  createCampaignMessage(campaignId, object) {
    let that = this;

    that.MailChimp.put('/campaigns/'+campaignId+'/content', {
      "plain_text": object.message,
      "html": object.message
    }).then(function(results) {
      
      // Send Campaign 
      return that.sentMessage(campaignId, object);

    }).catch(function(err) {
      console.log('Email not found');
      process.exit(0);
    })
  }

  createCampaign(listNo, resultsId, object) {
    let that = this;

    that.MailChimp.post('/campaigns', {
      "type": "regular",
      "recipients": {
        "list_id": listNo,
        "segment_opts": {
          "saved_segment_id": resultsId
        }
      },
      "settings": {
        "subject_line": object.subject,
        "from_name": object.user_name,
        "reply_to": object.user_email
      }
    }).then(function(results) {
      
      // Create Campaign Message
      return that.createCampaignMessage(results.id, object);

    }).catch(function(err) {
      console.log('Email not found');
      process.exit(0);
    });
  }

  createSegments(listNo, object, calls) {
    let that = this;

    that.MailChimp.post('/lists/'+listNo+'/segments', {
      "name": 'segment-' + (new Date()).getTime(),
      "static_segment": calls
    }).then(function(results) {

      // Create Campaign From List
      return that.createCampaign(listNo, results.id, object);

    }).catch(function (err) {
      console.log('Email not found', err);
      process.exit(0);
    });
  }

  processMessage(object) {
    let sent     = object.sent_to.split(',');
    let sentLen  = sent.length;
    let that     = this;
    let calls    = [];
    let listNo   = this.mailChimpObj.listId;
    let sentList = [];
    
    // Find Users Email Address
    that.users.getEmailAddressById(sent, (e, u) => {
      if(!e && u.length !== 0) {
        sentList = [];
        sentLen  = u.length;

        for(let idx = 0; idx < sentLen; idx++) {
          sentList.push({
            'method': 'post',
            'path': '/lists/'+listNo+'/members',
            'body': {
              'email_address': u[idx].email,
              'status': 'subscribed'
            }
          });
          calls.push(u[idx].email);
        }

        // Register Emails in List
        that.MailChimp.batch(sentList, (e, r) => {
          
          // Create Segment From List
          return that.createSegments(listNo, object, calls);

        }, {
          'wait' : true,
          'interval' : 2000,
          'unpack' : true,
        });
      }
      else {
        console.log('Email not found');
        process.exit(0);
      }
    });
  }

  execute() {
    let that = this;
    return this.settings.getSettings((e, s) => {
      if(e || !s) {
        console.log(e, 'Mailchimp settings not found.');
        process.exit(0);
      }

      this.mailChimpObj = {listId: s.mail_chimp_list, email: s.mail_chimp_email, name: s.mail_chimp_from_name};
      this.MailChimp    = new Mailchimp(s.mail_chimp_key);

      that.getMessage((e, m) => {
        if(e || !m) {
          console.log(e);
          process.exit(0);
        }
        return that.processMessage(m);
      });

    });
  }
}

let taskServer = new TaskServer(8003);
taskServer.getServer((server) => {
  // let mailchimp   = new Mailchimp(process.env.MAILCHIMP_API_KEY);
  let messageTask = new MessageTask(server);
  messageTask.execute();
})
