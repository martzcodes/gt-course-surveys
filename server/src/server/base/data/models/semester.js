'use strict';

import assert from 'assert';

class Model {
  static builder(snapshot) {
    return new Model(snapshot);
  }

  constructor(snapshot) {
    assert(snapshot);

    const val = snapshot.val();

    this._id = snapshot.key;
    this.season = val.season;
    this.year = val.year;

    if (this.isUnknown()) {
      this.title = 'Unknown';
    } else {
      this.title = `${Model.Seasons[this.season]} ${this.year}`;
    }
  }

  isUnknown() {
    return this._id === Model.UnknownId;
  }
}

Model.INI = 'SEM';
Model.UnknownId = '0000-0';
Model.Seasons = ['', 'Spring', 'Summer', 'Fall'];

export default Model;
