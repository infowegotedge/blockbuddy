import AppConfig from "./config/app-config";
import routes from './routes';
import cors from 'cors';
import methodOverride from 'method-override';
import helmet from 'helmet';
import {postgres} from "./models/index";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var boom = require('express-boom');

var app = express();

//Error Response
app.use(boom());

// Helmet helps you secure your Express apps by setting various HTTP headers
// https://github.com/helmetjs/helmet
app.use(helmet());

// Enable CORS with various options
// https://github.com/expressjs/cors
app.use(cors());

// Parse incoming request bodies
// https://github.com/expressjs/body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Lets you use HTTP verbs such as PUT or DELETE
// https://github.com/expressjs/method-override
app.use(methodOverride());

// Mount public routes
app.use('/public', express.static(`${__dirname}/public`));

// Mount API routes
app.use(AppConfig.apiPrefix, routes);

app.use(function (req, res) {
    res.boom.notFound(); // Responds with a 404 status code
});

//Database init
postgres.sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');

        postgres.sequelize.sync().then( function() {

            console.log( "================= Database Syncing complete ==============" );

            app.listen(AppConfig.appPort, () => {
              // eslint-disable-next-line no-console
              console.log(`
                Port: ${AppConfig.appPort}
                Env: ${app.get('env')}
              `);
            });

      })

    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

module.exports = app;