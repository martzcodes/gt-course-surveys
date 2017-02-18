'use strict';

import cors from 'cors';
import appConfig from '../../config/app';
import Logger from '../logger';

function origin(url, cb) {
  cb(null, appConfig.WHITELIST_DOMAINS.includes(url));
}

export default (app) => () => {
  app.use(cors({ origin }));

  Logger.info('base.boot.cors: Done!');
};
