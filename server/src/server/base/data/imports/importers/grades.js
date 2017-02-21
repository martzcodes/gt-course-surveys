'use strict';

import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import db from '../../../business/database';

function _parse(line) {
  const trimmed = _.trim(line);
  if (_.isEmpty(trimmed) || _.startsWith(trimmed, '#')) {
    return null;
  }

  const pieces = trimmed.split(':');
  const [semester, course] = pieces;
  if (_.isEmpty(semester) || _.isEmpty(course)) {
    return null;
  }

  const counts = _.chain(pieces[2]).trim().split(/[ ]+/).value();
  if (counts.length < 11) {
    return null;
  }

  return _.set({}, [course, semester], {
    a: _.toNumber(counts[0]),
    b: _.toNumber(counts[1]),
    c: _.toNumber(counts[2]),
    d: _.toNumber(counts[3]),
    f: _.toNumber(counts[4]),
    s: _.toNumber(counts[5]),  // ???
    u: _.toNumber(counts[6]),  // ???
    i: _.toNumber(counts[7]),  // ???
    w: _.toNumber(counts[8]),
    v: _.toNumber(counts[9]),  // ???
    t: _.toNumber(counts[10])
  });
}

class Importer {
  static async run() {
    const file = path.join(__dirname, '..', 'data', 'grades.txt');
    const data = await fs.readFileAsync(file, 'utf8');

    const grades = {};
    data.split('\n').forEach((line) => _.merge(grades, _parse(line)));
    await db.set('GRD', grades);
  }
}

export default Importer;
