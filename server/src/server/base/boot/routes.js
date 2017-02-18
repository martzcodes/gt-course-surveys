'use strict';

import Logger from '../logger';

export default () => () => {
  Logger.info('base.boot.routes: Done!');
};
