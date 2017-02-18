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
    this.department = val.department;
    this.foundational = val.foundational;
    this.icon = `icon-${val.icon}`;
    this.name = val.name;
    this.number = val.number;
    this.section = val.section;

    if (this.section) {
      this.title = `${this.number}-${this.section} ${this.name}`;
    } else {
      this.title = `${this.number} ${this.name}`;
    }
  }

  toObject() {
    return {
      department: this.department,
      foundational: this.foundational,
      icon: this.icon.slice(5),
      name: this.name,
      number: this.number,
      section: this.section
    };
  }
}

Model.INI = 'CRS';

export default Model;
