'use strict';

class Messages {
  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // User Schmea Definition
    let messageSchema = new Schema({
      userid: { type: Object },
      user_name: { type: String },
      user_email: { type: String },
      sent_to: { type: String },
      subject: { type: String },
      message: { type: String },
      status: { type: Number },
      created_at: { type: Date, "default": Date.now },
      updated_at: { type: Date, "default": Date.now }
    });

    // User Schmea Definition
    let notificationSchema = new Schema({
      userid: { type: Object },
      message: { type: String },
      status: { type: Number },
      notify_type: { type: String, "default": "USER" },
      block: { type: Boolean, "default": false },
      created_at: { type: Date, "default": Date.now },
      updated_at: { type: Date, "default": Date.now }
    });

    this.Messages = connection.model('Messages', messageSchema);
    this.Notification = connection.model('Notification', notificationSchema);
  }

  /**
   * Save Message
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  save(newValue, cb) {
    let Messages = new this.Messages(newValue);
    Messages.save(cb);
  }

  /**
   * Save Notification
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  saveNotification(userId, message, cb) {
    let newValue = {
      'userid': userId,
      'message': message,
      'status': 1,
      'notify_type': 'USER',
      'block': false
    };

    let notification = new this.Notification(newValue);
    notification.save(cb);
  }

  /**
   * Save Notification
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  saveAdminNotification(message, cb) {
    let newValue = {
      'userid': null,
      'message': message,
      'status': 1,
      'notify_type': 'BROADCAST',
      'block': false
    };

    let notification = new this.Notification(newValue);
    notification.save(cb);
  }

  /**
   *
   * @param {String} id
   * @param {callback} cb 
   */
  updateMessageStatus(id, cb) {
    return this.Messages.update({"_id": id}, {$set: {"status": 2}}, {"multi": true}, cb);
  }

  /**
   * Find Messages
   * @param {callback} cb 
   */
  findMessage(cb) {
    return this.Messages.findOne({"status": 1}).sort({"_id": 1}).exec(function(e, m) {
      if(e) {
        return cb(true, 'No message found.');
      }

      return cb(false, m)
    });
  }

  /**
   * Get Message By User
   * @param {String} messageId 
   * @param {String} userId 
   * @param {callback} cb 
   */
  getMessageUserList(messageId, userId, cb) {
    return this.Messages.findOne({"_id": messageId, "userid": userId}, '-_id sent_to', cb);
  }

  /**
   * 
   * @param {String} messageId 
   * @param {callback} cb 
   */
  markRead(messageId, cb) {
    return this.Messages.update({'_id': messageId}, {"$set": { "status": 2}}, cb);
  }

  /**
   * Get Total Inbox Message By User
   * @param {String} userId 
   * @param {callback} cb 
   */
  totalInboxMessage(userId, cb) {
    let regexp = new RegExp(userId);
    return this.Messages.count({"sent_to": regexp, "status": 2}, cb)
  }

  /**
   * Get Total Inbox Message By User
   * @param {String} userId 
   * @param {callback} cb 
   */
  totalInboxMessageStatus(userId, cb) {
    let regexp = new RegExp(userId);
    return this.Messages.count({"sent_to": regexp, "status": 1}, cb)
  }

  /**
   * Get Message By User
   * @param {String} userId 
   * @param {Number} currentPage
   * @param {Number} limit
   * @param {callback} cb 
   */
  inboxMessage(userId, type, currentPage, limit, cb) {
    let regexp  = new RegExp(userId);
    let regexp1 = new RegExp(userId, 'i');
    let offset  = ((currentPage - 1) * limit);
    let that    = this;
    let query   = {"$or": [{"sent_to": regexp}, {"subject": regexp1}]};

    if(parseInt(type) === 1) {
      query["status"] = 1;
      limit = 10;
    }
    
    let message = this.Messages.find(query, '_id subject message status user_name user_email created_at').sort({'created_at': -1}).limit(limit);

    if(offset !== 0) {
      message = message.skip(offset);
    }

    return message.exec((e, m) => {
      if(e) {
        return cb(true, 'Messages not found.')
      }

      return that.totalInboxMessage(userId, (e, mc) => {
        return that.totalInboxMessageStatus(userId, (ec, mcc) => {
          return cb(false, {"messages": m, "totalMessage": mc, "totalUnread": mcc});
        });
      });
    });
  }

  /**
   * Get Total Inbox Message By User
   * @param {String} userId 
   * @param {callback} cb 
   */
  totalNotificationStatus(userId, cb) {
    return this.Notification.count({"userid": userId, "status": 1, "notify_type": "USER", "block": false}, cb)
  }

  /**
   * GET Notification
   * @param {String} userId
   * @param {callback} cb 
   */
  userNotification(userId, cb) {
    let that = this;
    this.Notification.find({"userid": userId, "status": 1, "notify_type": "USER", "block": false}, '_id message status created_at').sort({'created_at': -1}).exec((e, n) => {
      if(!e) {
        that.totalNotificationStatus(userId, (e, t) => {
          that.Notification.update({"userid": userId, "status": 1, "notify_type": "USER", "block": false}, {"$set": {"status": 2}}, (e, nu) => {
            return cb(false, {"notifications": n, "totalRows": t});
          });
        });
      }
      else {
        return cb(true, "Notifications not found.");
      }
    });
  }

  /**
   * Get Total Inbox Message By User
   * @param {String} userId 
   * @param {callback} cb 
   */
  totalBroadCastNotificationStatus(cb) {
    return this.Notification.count({"notify_type": "BROADCAST", "block": false}, cb)
  }

  /**
   * GET Notification
   * @param {String} userId
   * @param {callback} cb 
   */
  broadCastNotification(currentPage, perPage, cb) {
    let that = this;
    let offset = (perPage * (currentPage - 1));

    let notify = this.Notification.find({"notify_type": "BROADCAST", "block": false}, '_id message status created_at block').sort({'created_at': -1}).limit(perPage);
    if(offset !== 0) {
      notify = notify.skip(offset);
    }
    
    notify.exec((e, n) => {
      if(!e) {
        that.totalBroadCastNotificationStatus((e, t) => {
          return cb(false, {"notifications": n, "totalRows": t});
        });
      }
      else {
        return cb(true, "Notifications not found.");
      }
    });
  }

  /**
   * GET Notification
   * @param {String} userId
   * @param {callback} cb 
   */
  updateBroadCastNotification(notifyId, cb) {

    return this.Notification.update({"_id": notifyId, "notify_type": "BROADCAST", "block": false}, {"block": true}, (e, n) => {
      if(!e) {
        return cb(false, n);
      }
      else {
        return cb(true, "Notifications not found.");
      }
    });
  }

  /**
   * GET Notification
   * @param {String} userId
   * @param {callback} cb 
   */
  adminNotification(cb) {
    return this.Notification.find({"notify_type": "USER", "block": false}, '_id userid message status created_at').sort({'created_at': -1}).limit(10).exec((e, n) => {
      if(!e) {
        return cb(false, n);
      }
      else {
        return cb(true, "Notifications not found.");
      }
    });
  }

  /**
   * Get Outbox Message By User
   * @param {String} userId 
   * @param {callback} cb 
   */
  totalOutboxMessage(userId, cb) {
    return this.Messages.count({"userid": userId}, cb)
  }

  /**
   * Get Message By User
   * @param {String} userId 
   * @param {Object} filter
   * @param {Number} currentPage
   * @param {Number} limit
   * @param {callback} cb 
   */
  outboxMessage(userId, filter, currentPage, limit, cb) {
    let query  = {"userid": userId};
    let offset = ((currentPage - 1) * limit);
    let that   = this;

    if(filter !== null) {
      query["$or"] = [{"sent_to": new RegExp(filter)}, {"subject": new RegExp(filter, 'i')}];
    }
    
    let message = this.Messages.find(query, '_id sent_to subject message created_at').sort({'created_at': -1}).limit(limit);

    if(offset !== 0) {
      message = message.skip(offset);
    }

    return message.exec((e, m) => {
      if(e) {
        return cb(true, 'Messages not found.')
      }

      return that.totalOutboxMessage(userId, (e, mc) => {
        return cb(false, {"messages": m, "totalMessage": mc});
      });
    });
  }
}

module.exports = Messages;
module.exports.getName = () => {
  return 'messages';
}