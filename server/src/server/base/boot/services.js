'use strict';

import _ from 'lodash';
import requireDir from 'require-dir';
import Logger from '../logger';

export default () => async(done) => {
  try {
    const services = _.map(requireDir('../business/services'), 'default');
    await Promise.all(_.map(services, (s) => s && s.init && s.init()));
    Logger.info('base.boot.services: Done!');
    done();
  } catch (error) {
    Logger.error('base.boot.services:', error);
  }
};
