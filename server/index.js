'use strict';

require('dotenv').config();

var _   = require('lodash');
var db  = require('./database');
var app = require('./config');

/**
 * Gets review aggregations for a course.
 *
 * @param {string} id Course ID.
 * @return {?Aggregation|Error}
 * @private
 */
app.get('/aggregation/:id', function (req, res) {
  db.get('aggregations/' + req.params.id)
    .then(function (snapshot) {
      res.status(200).json(snapshot.exists() ? _.assign(snapshot.val(), {id: snapshot.key}) : null);
    })
    .catch(function (error) {
      res.status(500).json(error);
    });
});

/**
 * Reviews and their courses, difficulties, workloads, and ratings.
 *
 * @type {object<ReviewId, Review>}
 * @private
 */
var reviews = {};

/**
 * Handles a review change by recalculating aggregations for the review's course.
 *
 * @param {!Snapshot}
 * @private
 */
function onReviewChanged(snapshot) {
  reviews[snapshot.key] = snapshot.val();

  var course = snapshot.val().course;
  db.set('aggregations/' + course, calculate(course));
}

/**
 * Handles a review removal by recalculating aggregations for the review's course.
 *
 * @param {!Snapshot}
 * @private
 */
function onReviewRemoved(snapshot) {
  delete reviews[snapshot.key];

  var course = snapshot.val().course;
  db.set('aggregations/' + course, calculate(course));
}

/**
 * Calculates the review aggregations for the course.
 *
 * @param {string} course Course ID.
 * @return {object} Aggregations.
 * @private
 */
function calculate(course) {
  var courseReviews = _.filter(reviews, ['course', course]);

  var values = {
    d: _.chain(courseReviews).map('difficulty').filter(_.isNumber).value(),
    w: _.chain(courseReviews).map('workload').filter(_.isNumber).value(),
    r: _.chain(courseReviews).map('rating').filter(_.isNumber).value()
  };

  return {
    count: courseReviews.length,
    average: {
      difficulty: averageOf(values.d),
      workload:   averageOf(values.w),
      rating:     averageOf(values.r)
    },
    hash: _.chain(reviews)
      .pickBy(['course', course])
      .map(function (review, id) {
        return [id, review.difficulty, review.workload, review.rating];
      })
      .flatten()
      .reduce(function (hash, x) {
        /* jshint bitwise: false */
        return hash ^ hashCode(_.toString(x));
      })
      .value() || 0
  };

  /**
   * Calculates the average of a list of numbers.
   *
   * @param {!Array<number>} values
   * @return {number}
   * @private
   */
  function averageOf(values) {
    return values.length > 0 ? _.ceil(_.sum(values) / values.length, 1) : 0;
  }
}

/**
 * Calculates the hash code for a string.
 *
 * @param {string} s
 * @return {number} 32-bit integer.
 * @private
 */
function hashCode(s) {
  var hash = 0, i, char, l;

  if (s.length === 0) {
    return hash;
  }

  for (i = 0, l = s.length; i < l; i++) {
    char  = s.charCodeAt(i);
    hash  = ((hash << 5) - hash) + char;
    hash |= 0;
  }

  return hash;
}

/**
 * Handles process termination.
 *
 * @param {object} options
 * @param {!Error} error
 * @private
 */
function onExit(options, error) {
  if (options.cleanup) {
    /* cleanup */
  }
  if (error) {
    console.log(error.stack);
  }
  if (options.exit) {
    process.exit();
  }
}

process.stdin.resume();

process.on('exit', onExit.bind(null, {cleanup: true}));
process.on('SIGINT', onExit.bind(null, {exit: true}));
process.on('uncaughtException', onExit.bind(null, {exit: true}));

var server = app.listen(process.env.PORT || process.env.DEFAULT_PORT, function () {
  console.log('Listening on port %d...', server.address().port);

  db.ref('reviews').on('child_added',   onReviewChanged);
  db.ref('reviews').on('child_changed', onReviewChanged);
  db.ref('reviews').on('child_removed', onReviewRemoved);
});
