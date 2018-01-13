'use strict';

let Validator = require('./validators/request.validator');
let apiPath   = process.env.SERVER_PATH + process.env.API_PATH;

// Message Routes
let MessageRoutes = [
  // GET List Message Send Request
  {
    method: 'POST',
    path: apiPath+'message/send',
    config: {
      validate: {
        payload: Validator.getPostParameter()
      },
      handler: require('./actions/create')
    }
  }, 
  // GET List Of Message In Inbox Request
  {
    method: 'GET',
    path: apiPath+'message/inbox',
    config: {
      handler: require('./actions/inboxmessage')
    }
  }, 
  // GET List Of Message In Inbox Request
  {
    method: 'GET',
    path: apiPath+'notifications',
    config: {
      handler: require('./actions/list-notifications')
    }
  },
  // GET List Of Message In Sent Request
  {
    method: 'GET',
    path: apiPath+'message/sent',
    config: {
      handler: require('./actions/outboxmessage')
    }
  }, 
  // GET List Of Users to Send Message
  {
    method: 'POST',
    path: apiPath+'message/list-users',
    config: {
      validate: {
        payload: Validator.getUsersParameter()
      },
      handler: require('./actions/listusers')
    }
  }, 
  // POST Mark Messages as Read
  {
    method: 'POST',
    path: apiPath+'message/mark-read',
    config: {
      validate: {
        payload: Validator.getMarkReadParameter()
      },
      handler: require('./actions/mark-read')
    }
  }
];

module.exports = MessageRoutes;