'use strict';

require('dotenv').config();

var _    = require('lodash');
var q    = require('q');
var fs   = require('fs');
var path = require('path');
var db   = require('../database');

readGradesFromFile()
.then(function (grades) {
  return db.set('grades', grades);
})
.then(function () {
  console.log('Grades updated.');
})
.catch(function (error) {
  console.log('Error:', error.message);
})
.finally(process.exit);

/**
 * Reads grades from file.
 *
 * @return {!Promise(object)}
 */
function readGradesFromFile() {
  var deferred = q.defer();

  var fileName = path.join(__dirname, 'grades.txt');

  fs.readFile(fileName, 'utf8', function (error, data) {
    if (error) {
      deferred.reject(error);
    } else {
      var grades = {};

      _.forEach(data.split('\n'), function (line) {
        _.merge(grades, parse(line));
      });

      deferred.resolve(grades);
    }
  });

  return deferred.promise;
}

/**
 * Parses a line of grades.
 *
 * @param {string} line
 * @return {object}
 */
function parse(line) {
  var trimmed = _.trim(line);
  if (_.isEmpty(trimmed) || trimmed[0] === '#') {
    return null;
  }

  var pieces = trimmed.split(':');
  var semester = _.trim(pieces[0]);
  var course = _.trim(pieces[1]);
  if (_.isEmpty(semester) || _.isEmpty(course)) {
    return null;
  }

  var counts = _.trim(pieces[2]).split(/[ ]+/);
  if (counts.length < 11) {
    return null;
  }

  return _.set({}, [course, semester], {
    a:     _.toNumber(counts[0]),
    b:     _.toNumber(counts[1]),
    c:     _.toNumber(counts[2]),
    d:     _.toNumber(counts[3]),
    f:     _.toNumber(counts[4]),
    s:     _.toNumber(counts[5]),  // ???
    u:     _.toNumber(counts[6]),  // ???
    i:     _.toNumber(counts[7]),  // ???
    w:     _.toNumber(counts[8]),
    v:     _.toNumber(counts[9]),  // ???
    total: _.toNumber(counts[10])
  });
}
