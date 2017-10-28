'use strict';

import _ from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';
import db, { archive } from '../base/business/database';
import Logger from '../base/logger';

const yearsToKeep = [
  moment.utc().year()
];

function shouldKeep({ semester }) {
  return _.some(yearsToKeep, (year) => semester.includes(year));
}

function handle(review, id) {
  if (shouldKeep(review)) {
    return Promise.resolve();
  }

  Logger.info(`Archiving ${id}...`);

  return Promise.all([
    db.ref('RVW').child(id).remove(),
    archive.ref('RVW').child(id).set(review)
  ]);
}

db.get('RVW')
  .then((reviews) => Promise.all(_.map(reviews.val(), handle)))
  .then(process.exit)
  .catch(Logger.error);
