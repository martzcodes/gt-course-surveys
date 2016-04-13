'use strict';

/**
 * IMPORTS
 */

var _    = require('lodash');
var fs   = require('fs');
var rsvp = require('rsvp');

/**
 * FIREBASE WRAPPERS
 */

var firebase        = require('firebase');
var firebaseRef     = new firebase('https://gt-surveyor.firebaseio.com/');
var firebaseSecret  = 'k1exBnlMQBp4y9bxWe1vTBgCLioEDmq48JscivvH';

function authenticate() {
    return new rsvp.Promise(function (resolve, reject) {
        firebaseRef.authWithCustomToken(firebaseSecret, function (error, result) {
            if (error) {
                return reject(error);
            } else {
                return resolve(result);
            }
        });
    });
}

function read(what) {
    return new rsvp.Promise(function (resolve, reject) {
        firebaseRef.child(what).once('value', function (snapshot) {
            return resolve(snapshot.val());
        }, reject);
    });
}

function set(what, toWhat) {
    return new rsvp.Promise(function (resolve, reject) {
        firebaseRef.child(what).set(toWhat, function (error) {
            if (error) {
                return reject(error);
            } else {
                return resolve(toWhat);
            }
        });
    });
}

/**
 * MAIN
 */

authenticate()
.then(function () {
    return read('courses');
})
.then(function (courses) {
    return readGradesFromFile(_.mapValues(courses, function () { return {}; }));
})
.then(function (grades) {
    return set('grades', grades);
})
.then(function () {
    console.log('Grades updated.');
    process.exit();
})
.catch(function (error) {
    console.error('Error:', error.message);
    process.exit();
});

function readGradesFromFile(grades) {
    return new rsvp.Promise(function (resolve, reject) {
        var fileName = __dirname + '/data.txt';
        fs.readFile(fileName, 'utf8', function (error, data) {
            if (error) {
                return reject(error);
            }

            _.forEach(data.split('\n'), function (line) {
                var parsed = readGradesFromLine(line);
                if (parsed !== null) {
                    var courseGradesSoFar = grades[parsed.courseId];
                    _.forIn(parsed.grades, function (value, key) {
                        courseGradesSoFar[key] = courseGradesSoFar[key] || 0;
                        courseGradesSoFar[key] += value;
                    });
                }
            });

            return resolve(grades);
        });
    });
}

function readGradesFromLine(line) {
    var trimmed = _.trim(line);
    if (_.isEmpty(trimmed) || trimmed[0] === '#') {
        return null;
    }

    var pieces = trimmed.split(':');
    var courseId = _.trim(pieces[0]);
    if (_.isEmpty(courseId)) {
        return null;
    }

    var counts = _.trim(pieces[1]).split(/[\ ]+/);
    if (counts.length < 11) {
        return null;
    }

    return {
        courseId: courseId,
        grades: {
            a:      _.toNumber(counts[0]),
            b:      _.toNumber(counts[1]),
            c:      _.toNumber(counts[2]),
            d:      _.toNumber(counts[3]),
            f:      _.toNumber(counts[4]),
            s:      _.toNumber(counts[5]),    // ???
            u:      _.toNumber(counts[6]),    // ???
            i:      _.toNumber(counts[7]),    // ???
            w:      _.toNumber(counts[8]),
            v:      _.toNumber(counts[9]),    // ???
            total:  _.toNumber(counts[10])
        }
    };
}
