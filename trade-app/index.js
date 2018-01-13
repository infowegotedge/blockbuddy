// Used as entry for development server only
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('babel-register');

// Load environment variables
require('dotenv').config();

// Initialize Server
require('./app');

require('./tasks/index');