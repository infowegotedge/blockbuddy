'use strict';

require('dotenv').config();
const apiBasePath = process.env.API_DIR_PATH;
const modelSuffix = process.env.MODULE_SUFFIX;
const Composer    = require('./index');
const LoadModels  = require('./model.manifest').loadModels;
const validate    = require(apiBasePath + '/auth/validators/token.validator');
const engine      = require('hapi-react')();
const SignJWT     = require('./server/component/sign_jwt');

Composer((err, server) => {

  if (err) {
    console.log('Error: Traced >>> ', err);
    throw err;
  }

  // PreResponse Handler to Catch BOOM Errors
  const preResponse = function (request, reply) {

    let response = request.response;
    // console.log(response);
    if (response.isBoom) {
      if (response.output.statusCode === 401) {
        return reply({"hasError": true, "message": "Invalid Token"}).code(404);
      }
      // Replace error
      let error = response;
      let ctx = {
        statusCode: error.output.statusCode,
        error: error.output.payload.error,
        message: (error.isDeveloperError ? 'Oops! it\'s not you, it\'s us.' : error.output.payload.message),
        hasError: true
      };
      if(parseInt(process.env.ALLOW_DEBUG) === 1) { console.log(error); }
      return reply(ctx).code(200);
    }
    
    return reply.continue();
  };

  // perRequest Handler
  const methodRequest = function (request, reply) {
    let Settings  = request.server.settings.app.settings;
    let Rates     = request.server.settings.app.pmrrates;
    let configSet = {
      cut_off_value: 0, affiliation_fee: 0, affiliation_amount: 0,
      withdrawal_fee: 0, withdrawal_auto_limit: 0, withdrawal_min_limit: 0,
      withdrawal_max_limit: 0, transfer_fee: 0, transfer_per_user_day_limit: 0,
      mail_chimp_key: null, mail_chimp_list: null, mail_chimp_email: null, mail_chimp_from_name: null
    };
    let ratesSet  = {
      pool: { price: 0, precent: 0, power: 0, pv: 0, persons: 0, machine: 0, powerCost: 0, profitCost: 0 },
      machine: { price: 0, precent: 0, power: 0, pv: 0, persons: 0, machine: 0, powerCost: 0, profitCost: 0 },
      rack: { price: 0, precent: 0, power: 0, pv: 0, persons: 0, machine: 0, powerCost: 0, profitCost: 0 }
    }

    request.server.settings.app.KYCConfig = {
      kycRole: {
        admin : { canApprove : true, canVerify: true },
        supervisor: { canApprove : true, canVerify: false },
        moderator : { canApprove : false, canVerify: true }
      },
      kycFlagsList: [ "PENDING", "UNVERIFIED", "ONHOLD", "REJECTED",  "APPROVED", "VERIFIED" ],
      kycFlags:{
        kycPendingFlag: {status: "PENDING", text: "Pending Verification", approvalStatus: false , canEdit: false},
        kycUnverifiedFlag: {status: "UNVERIFIED", text: "Unverified", approvalStatus: false , canEdit: true},
        kycHoldFlag: {status: "ONHOLD", text: "On Hold", approvalStatus: false, canEdit: false},
        kycVerifiedFlag: {status: "VERIFIED", text: "Verified", approvalStatus: false, canEdit: false},
        kycRejectedFlag: {status: "REJECTED", text: "Rejected", approvalStatus: false, canEdit: true},
        kycApprovedFlag: {status: "APPROVED", text: "Pending Verification", approvalStatus: true, canEdit: false}
      },
      kycUploadFileTypes: [ "image/png", "image/jpeg", "image/jpg" ],
      kycAllowedDocs : {
        NA: {text: "Not Available", key: 'NA'},
        OTHERS: {text: "Other Government issued ids", key: 'OTHERS'},
        DL: {text: "Driving Licence", key: "DL"},
        PASSPORT: {text: "PASSPORT", key: "PASSPORT"}
      },
    }

    return Settings.getSettings((e, settings) => {
      request.server.settings.app.ConfigSettings = ((!e && settings) ? settings : configSet);
      return Rates.getRates((er, rates) => {
        request.server.settings.app.ConfigRates = ((!e && rates) ? rates : ratesSet);
        return reply.continue();
      });
    });
  }

  server.ext([
    {
      "type": 'onPreResponse', 
      "method": preResponse
    }, {
      "type": "onRequest", 
      "method": methodRequest
    }
  ]);

  // Authentication Strategy
  server.auth.strategy('token', 'sign-jwt', {
    key: SignJWT.certificate(),
    validateFunc: validate,
    verifyOptions: SignJWT.validateOptions()
  });

  server.auth.default('token');

  // Register all routes here because they pre-loads
  // and strategy are post-load which cause
  // error and API is load
  server.register([{
    register: require('acquaint'),
    options: {
      relativeTo: __dirname,
      routes: [
        {
          includes: [
            apiBasePath + '/**/*Routes.js',
            apiBasePath + '/index.js'
          ]
        }
      ],
    }
  }, {
    register: require('vision'),
    options: {}
  }], (err) => {

    // Settings to make authentication cookie
    // session based
    server.state(process.env.AUTH_COOKIE_NAME, {
      ttl: null,
      isSecure: true,
      isHttpOnly: true,
      encoding: 'base64json',
      clearInvalid: true, // remove invalid cookies
      strictHeader: true // don't allow violations of RFC 6265
    });

    // Setting App models
    const hapiMongoose  = server.plugins['hapi-mongoose'];
    server.settings.app = LoadModels(apiBasePath, modelSuffix, hapiMongoose);

    // KickStart Web Server
    server.start(() => {
      console.log('Mining-BTC-ETH API Server Running on port ' + server.info.port);
    });
  });

});
