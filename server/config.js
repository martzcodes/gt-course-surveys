'use strict';

var express    = require('express');
var bodyParser = require('body-parser');
var cors       = require('cors');

var app = express();

// PARSER

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// HTTPS

app.use(function (req, res, next) {
  var host = req.get('Host');
  if (host.indexOf('localhost') === -1 && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', host, req.url].join(''));
  } else {
    return next();
  }
});

// CORS

var corsWhiteList = [
  // Local
  'http://localhost:3000',

  // Firebase default
  'https://' + process.env.FIREBASE_ENV + '.firebaseapp.com',

  // Custom domain
  'https://omscentral.com'
];

var corsOptions = {
  origin: function (origin, callback) {
    var inWhiteList = corsWhiteList.indexOf(origin) !== -1;
    callback(null, inWhiteList);
  }
};

app.use(cors(corsOptions));

// EXPORTS

module.exports = app;
