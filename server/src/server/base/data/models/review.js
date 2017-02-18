'use strict';

import _ from 'lodash';
import assert from 'assert';
import moment from 'moment';
import db from '../../business/database';

class Model {
  static builder(snapshot) {
    return new Model(snapshot);
  }

  constructor(snapshot) {
    assert(snapshot);

    const val = snapshot.val();

    this._id = snapshot.key;
    this.created = moment.utc(val.created);
    this.updated = val.updated ? moment.utc(val.updated) : null;
    this.author = val.author;
    this.semester = val.semester;
    this.course = val.course;
    this.difficulty = val.difficulty;
    this.workload = val.workload;
    this.rating = _.get(val, 'rating', null);
    this.text = val.text;
  }

  save() {
    return db.set(`${Model.INI}/${this._id}`, this.toObject());
  }
}

Model.INI = 'RVW';

export default Model;
