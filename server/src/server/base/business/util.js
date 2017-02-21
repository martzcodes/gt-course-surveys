'use strict';

import _ from 'lodash';
import assert from 'assert';
import moment from 'moment';
import Logger from '../logger';

class Util {
  static many(options) {
    assert(options.model);
    assert(options.snapshot);

    const entities = [];

    options.snapshot.forEach((snapshot) => {
      entities.push(options.model.builder(snapshot));
    });

    return entities;
  }

  static one(options) {
    assert(options.model);
    assert(options.snapshot);

    return options.model.builder(options.snapshot);
  }

  static on(cb, model) {
    assert(cb);
    assert(model);

    return (snapshot) => {
      const val = snapshot.val();
      const time = _.get(val, 'updated') || _.get(val, 'created');
      const init = moment.utc(process.env.INIT_MOMENT);
      if (time && init.isBefore(moment.utc(time))) {
        try {
          const entity = Util.one({ model, snapshot });
          cb(entity, model, snapshot);
        } catch (error) {
          Logger.error('base.business.util:', error);
        }
      }
    };
  }
}

export default Util;
