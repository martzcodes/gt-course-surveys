
var bodyParser = require('body-parser');
var env = process.env.NODE_ENV || 'development';

function forceSsl (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
 };

module.exports = function (app, express) {
  if (env === 'production') {
    app.use(forceSsl);
  }
  app.use('/', express.static('app/'));
  app.set('views', __dirname + '/../app/views');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
};
