'use strict';

import _ from 'lodash';
import moment from 'moment';
import { archive } from '../../../business/database';

class Reducer {
  static async reduce(review) {
    const updates = _.pick(review, [
      'semester',
      'difficulty',
      'workload',
      'rating',
      'text'
    ]);

    updates.updated = moment.utc().format();

    await archive.ref('RVW').child(review._id).update(updates);

    return true;
  }
}

export default Reducer;
