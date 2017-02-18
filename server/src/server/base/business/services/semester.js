'use strict';

import db from '../database';
import Semester from '../../data/models/semester';
import Util from '../util';

async function get() {
  return Util.many({
    model: Semester,
    snapshot: await db.get('SEM')
  });
}

async function getById(id) {
  return Util.one({
    model: Semester,
    snapshot: await db.get(`SEM/${id}`)
  });
}

export default {
  get,
  getById
};
