process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('babel-register');

// Load environment variables
require('dotenv').config();

var mg = require( './mg' );

mg();


