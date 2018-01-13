// Used as entry for development server only
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

require('babel-register');

// Load environment variables
require('dotenv').config();

// Initialize Server
require('./task/assign-coins.task');
