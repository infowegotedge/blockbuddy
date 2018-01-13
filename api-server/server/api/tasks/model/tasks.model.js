'use strict';

// const crypt = require('crypto')

class Tasks {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // Tasks Schema Definition
    let tasksSchema = new Schema({
      taskid: { type: Object },
      taskname: { type: String }
    });

    // Task Schema
    this.Task = connection.model('Tasks', tasksSchema);
  }

  /**
   * 
   * @param {String} taskName 
   * @param {callback} cb 
   */
  getTask(taskName, cb) {
    return this.Task.findOne({"taskname": taskName}, cb);
  }

  /**
   * 
   * @param {String} taskName 
   * @param {String} taskId
   * @param {callback} cb 
   */
  create(taskName, taskId, cb) {
    let task = new this.Task({"taskname": taskName, "taskid": taskId});
    task.save(cb);
  }

  /**
   * 
   * @param {String} taskName 
   * @param {String} taskId 
   * @param {callback} cb 
   */
  update(taskName, taskId, cb) {
    let that = this;
    that.Task.findOne({"taskname": taskName}, function(e, t) {
      if(!e && t) {
        return t.update({"taskid": taskId}, cb)
      }
      else {
        return cb(true, 'Task not found')
      }
    })
  }
}

module.exports = Tasks;
module.exports.getName = () => {
  return 'tasks';
}