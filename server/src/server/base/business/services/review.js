'use strict';

import _ from 'lodash';

function hash(reviews) {
  return _.chain(reviews)
    .map((r) => [r._id, r.difficulty, r.workload, r.rating])
    .flatten()
    // eslint-disable-next-line no-bitwise
    .reduce((hashCode, x) => hashCode ^ _.toString(x).hashCode())
    .value() || 0;
}

export default {
  hash
};
