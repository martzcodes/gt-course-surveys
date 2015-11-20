
var _ = require('lodash');
var fs = require('fs');
var rsvp = require('rsvp');
var firebase = require('firebase');
var firebaseRef = new firebase('https://gt-surveyor.firebaseio.com/');

function loadCourses() {
  return new rsvp.Promise(function (resolve, reject) {
    firebaseRef.child('courses').once('value', function (courses) {
      if (courses.exists()) {
        resolve(courses.val());
      }
      else {
        reject(null);
      }
    });
  });
};

function readGradesCs(grades) {
  return readGradesFile('./cs.txt', grades);
};

function readGradesCse(grades) {
  return readGradesFile('./cse.txt', grades);
};

function readGradesFile(fileName, grades) {
  return new rsvp.Promise(function (resolve, reject) {
    fs.readFile(fileName, 'utf8', function (error, data) {
      if (error) {
        reject(error);
      }
      else {
        var lines = data.split('\n'), pieces, courseId, courseGrades;
        _.each(lines, function (line) {
          pieces = line.trim().split(/[\ ]+/);

          courseId = pieces[0];
          if (courseId === '8803' && fileName.indexOf('cse.txt') > 0) {
            courseId = '8803-BDHI';
          }
          if (courseId === '4495' && fileName.indexOf('cs.txt') > 0) {
            courseId = '6476';
          }
          if (grades[courseId] === undefined) {
            return;
          }

          courseGrades = {
            a:      Number(pieces[1]),
            b:      Number(pieces[2]),
            c:      Number(pieces[3]),
            d:      Number(pieces[4]),
            f:      Number(pieces[5]),
            s:      Number(pieces[6]),    // ???
            u:      Number(pieces[7]),    // ???
            i:      Number(pieces[8]),    // ???
            w:      Number(pieces[9]),
            v:      Number(pieces[10]),   // ???
            total:  Number(pieces[11])
          };

          if (grades[courseId] === null) {
            grades[courseId] = courseGrades;
          }
          else {
            _.forIn(courseGrades, function (value, of) {
              grades[courseId][of] = grades[courseId][of] + value;
            });
          }
        });
        resolve(grades);
      }
    });
  });
};

function saveGrades(grades) {
  return new rsvp.Promise(function (resolve, reject) {
    firebaseRef.child('grades').set(grades, function (error) {
      if (error) {
        reject(error);
      }
      else {
        resolve(null);
      }
    })
  });
};

var grades = {};

loadCourses()
  .then(function (courses) {
    _.forIn(courses, function (course, id) { grades[id] = null; });
    return readGradesCs(grades);
  })
  .then(function (grades) {
    return readGradesCse(grades);
  })
  .then(function (grades) {
    return saveGrades(grades);
  })
  .then(function (result) {
    console.log('grades saved');
    process.exit();
  })
  .catch(function (error) {
    console.error(error);
    process.exit();
  });
