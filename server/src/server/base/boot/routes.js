'use strict';

import Logger from '../logger';
import V1Routes from '../api/v1/routes';

export default (app) => () => {
  app.use('/api/v1', V1Routes);

  Logger.info('base.boot.routes: Done!');
};
