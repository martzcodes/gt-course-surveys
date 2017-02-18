'use strict';

import appConfig from '../../config/app';
import Logger from '../logger';

export default () => (done) => {
  Logger.info('base.boot.wait: Waiting...');
  setTimeout(done, appConfig.WAIT_INTERVAL);
};
