(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Grade', Grade);

  /** @ngInject */
  function Grade($q, msUtils, firebase, _) {
    var cache = {};

    var service = {
      all: all,
      get: get,
      none: none
    };

    return service;

    //////////

    /**
     * Gets grades for all courses.
     *
     * @return {!Map<CourseId, Map<SemesterId, SemesterGrades>>}
     */
    function all() {
      if (!_.isEmpty(cache)) {
        return $q.resolve(cache);
      }

      var deferred = $q.defer();

      firebase
        .database()
        .ref('grades')
        .once('value')
        .then(function (snapshot) {
          var grades = denormalize(snapshot.val());

          cache = grades;

          deferred.resolve(grades);
        })
        .catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Gets the grades for a course.
     *
     * @param {string} id Course ID.
     * @return {!Map<SemesterId, SemesterGrades>}
     */
    function get(id) {
      var cached = _.get(cache, id);
      if (cached) {
        return $q.resolve(cached);
      }

      var deferred = $q.defer();

      all().then(function (grades) {
        deferred.resolve(grades[id]);
      }).catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Denormalizes grades for convenience.
     *
     * @param {!Map<CourseId, Map<SemesterId, SemesterGrades>>} grades
     * @return {!Map<CourseId, Map<SemesterId, SemesterGrades>>}
     * @private
     */
    function denormalize(grades) {
      var total = 0;
      var totalWithoutWithdrawals = 0;

      // For each course's grades...
      _.forEach(grades, function (courseGrades, courseId) {

        // For each semester's grades...
        _.forEach(courseGrades, function (semesterGrades, semesterId) {
          total = semesterGrades.total;
          totalWithoutWithdrawals = total - semesterGrades.w;

          semesterGrades = _.omit(semesterGrades, 'total');
          semesterGrades.t = total;

          grades[courseId][semesterId] = {
            '#': semesterGrades,
            '%': _.chain(semesterGrades).map(function (value, key) {
              return [key, percent(value, total)];
            }).fromPairs().assign({ t: 100 }).value(),
            '~': _.chain(semesterGrades).map(function (value, key) {
              return [key, percent(value, totalWithoutWithdrawals)];
            }).fromPairs().assign({ t: 100, w: 0 }).value()
          };
        });

        // Combined across all semesters stored under 'all' for a given course...
        var counts = _.reduce(grades[courseId], function (all, current) {
          return _.isEmpty(all) ? current['#'] : _.mapValues(all, function (value, key) {
            return value + current['#'][key];
          });
        }, {});

        total = _.reduce(counts, function (sum, count, key) {
          return sum + (key === 't' ? 0 : count);
        });

        totalWithoutWithdrawals = _.reduce(counts, function (sum, count, key) {
          return sum + (key === 't' || key === 'w' ? 0 : count);
        });

        grades[courseId]['all'] = {
          '#': counts,
          '%': _.chain(counts).map(function (value, key) {
            return [key, percent(value, total)];
          }).fromPairs().assign({ t: 100 }).value(),
          '~': _.chain(counts).map(function (value, key) {
            return [key, percent(value, totalWithoutWithdrawals)];
          }).fromPairs().assign({ t: 100, w: 0 }).value()
        };
      });

      /**
       * Calculates the percentage a value is of a total.
       *
       * @param {number} value
       * @param {number} total
       * @return {number} Rounded to 1 decimal place.
       * @private
       */
      function percent(value, total) {
        return total > 0 ? _.round((value * 100.0) / total, 1) : 0;
      }

      return grades;
    }

    /**
     * Gets the aggregation for a course with no reviews.
     *
     * @return {!SemesterGrades}
     */
    function none() {
      return {
        '#': {a: 0, b: 0, c: 0, d: 0, f: 0, i: 0, s: 0, u: 0, v: 0, w: 0, t: 0},
        '%': {a: 0, b: 0, c: 0, d: 0, f: 0, i: 0, s: 0, u: 0, v: 0, w: 0, t: 0},
        '~': {a: 0, b: 0, c: 0, d: 0, f: 0, i: 0, s: 0, u: 0, v: 0, w: 0, t: 0}
      };
    }
  }
})();
