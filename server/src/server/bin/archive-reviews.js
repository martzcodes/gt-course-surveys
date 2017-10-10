'use strict';

import _ from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';
import db, { archive } from '../base/business/database';
import Logger from '../base/logger';

const years = [
  moment.utc().year(),
  moment.utc().year() - 1
];

function shouldKeep({ semester }) {
  return _.some(years, (year) => semester.includes(year));
}

function handle(review, id) {
  if (shouldKeep(review)) {
    return Promise.resolve();
  }

  Logger.info(`Moving ${id}...`);

  return Promise.all([
    db.ref('RVW').child(id).remove(),
    archive.ref('RVW').child(id).set(review)
  ]);
}

db.get('RVW')
  .then((reviews) => Promise.all(_.map(reviews.val(), handle)))
  .then(process.exit)
  .catch(Logger.error);
