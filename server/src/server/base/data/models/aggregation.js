'use strict';

import _ from 'lodash';
import assert from 'assert';
import db from '../../business/database';

class Model {
  static builder() {
    return new Model();
  }

  constructor() {
    this._id = null;
    this.count = 0;
    this.average = {
      difficulty: 0,
      workload: 0,
      rating: 0
    };
    this.hash = 0;
  }

  toObject() {
    return {
      count: this.count,
      average: this.average,
      hash: this.hash
    };
  }

  setId(id) {
    this._id = id;
    return this;
  }

  setCount(count) {
    assert(_.isNumber(count));
    assert(count >= 0);
    this.count = count;
    return this;
  }

  setDifficulty(difficulty) {
    assert(_.isNumber(difficulty));
    assert(difficulty >= 1 && difficulty <= 5);
    this.average.difficulty = _.round(difficulty, 1);
    return this;
  }

  setWorkload(workload) {
    assert(_.isNumber(workload));
    assert(workload >= 1);
    this.average.workload = _.round(workload, 1);
    return this;
  }

  setRating(rating) {
    assert(_.isNumber(rating));
    assert(rating >= 1 && rating <= 5);
    this.average.rating = _.round(rating, 1);
    return this;
  }

  setHash(hash) {
    assert(_.isNumber(hash));
    this.hash = hash;
    return this;
  }

  save() {
    return db.set(`${Model.INI}/${this._id}`, this.toObject());
  }
}

Model.INI = 'AGG';

export default Model;
