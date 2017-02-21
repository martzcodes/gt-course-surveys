'use strict';

import db from '../database';
import Semester from '../../data/models/semester';
import Util from '../util';

class Service {
  static async get() {
    return Util.many({
      model: Semester,
      snapshot: await db.get('SEM')
    });
  }

  static async getById(id) {
    return Util.one({
      model: Semester,
      snapshot: await db.get(`SEM/${id}`)
    });
  }
}

export default Service;
