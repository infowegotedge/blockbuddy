import AppConfig from '../../config/app-config'

var mongoose = require('mongoose');

// Use native promises
mongoose.Promise = global.Promise;

// Connect to our mongo database;
mongoose.connect( AppConfig.mongo.uri );
mongoose.connection.on('error', (err) => {
    throw err;
});

module.exports = mongoose;