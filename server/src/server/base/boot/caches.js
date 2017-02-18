'use strict';

import Cache from '../business/cache';
import Course from '../data/models/course';
import Logger from '../logger';
import Review from '../data/models/review';

export default () => async(done) => {
  try {
    await Cache.make(Course);
    await Cache.make(Review);
    Logger.info('base.boot.caches: Done!');
    done();
  } catch (error) {
    Logger.error('base.boot.caches:', error);
  }
};
