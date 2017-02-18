'use strict';

import bodyParser from 'body-parser';
import morgan from 'morgan';
import appConfig from '../../config/app';
import Logger from '../logger';

function _https(req, res, next) {
  if (/^staging|production$/.test(process.env.NODE_ENV) &&
    req.headers['x-forwarded-proto'] !== 'https') {
    res.redirect(`https://${req.get('Host')}{req.url}`);
  } else {
    next();
  }
}

export default (app) => () => {
  app.set('port', appConfig.PORT);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(morgan(appConfig.LOG_LEVEL_MORGAN));
  app.use(_https);

  Logger.info('base.boot.config: Done!');
};
