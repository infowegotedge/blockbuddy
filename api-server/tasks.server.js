'use strict;'

require('dotenv').config();

class TaskServer {

  constructor(port) {

    this.portConfig = port;
  }

  getServer(cb) {
    const Hapi = require('hapi');
    // Create a server with a host and port
    const server = new Hapi.Server();
    server.connection({
      host: 'localhost',
      port: this.portConfig
    });

    let plugin = {
      register: require('hapi-mongoose'),
      options: {
        bluebird: true,
        uri: 'mongodb://' + process.env.MONGOOSE_DB_PATH + '/' + process.env.MONGOOSE_DB
      }
    };

    server.register(plugin, (err) => {
      if (err) {
        console.error('Failed to load plugin:', err);
      }

      server.start((err) => {
        if (err) {
          throw err;
        }

        cb(server);
      });
    });
  }
}

module.exports = TaskServer;