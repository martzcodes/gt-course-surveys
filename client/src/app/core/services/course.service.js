(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Course', Course);

  /** @ngInject */
  function Course($q, msUtils, firebase, _) {
    var cache = {};

    var service = {
      clear: clear,
      all: all,
      get: get
    };

    return service;

    //////////

    /**
     * Clears the cache.
     */
    function clear() {
      cache = {};
    }

    /**
     * Gets all courses.
     *
     * @return {!Promise(!Array<Course>)}
     */
    function all() {
      if (!_.isEmpty(cache)) {
        return $q.resolve(_.values(cache));
      }

      var deferred = $q.defer();

      firebase
        .database()
        .ref('courses')
        .once('value')
        .then(function (snapshot) {
          var courses = denormalize(msUtils.manyRecordsFromSnapshot(snapshot));

          cache = _.zipObject(_.map(courses, 'id'), courses);

          deferred.resolve(courses);
        })
        .catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Gets a course.
     *
     * @param {string} id
     * @return {!Promise(?Course)}
     */
    function get(id) {
      var cached = _.get(cache, id);
      if (cached) {
        return $q.resolve(cached);
      }

      var deferred = $q.defer();

      all().then(function (courses) {
        deferred.resolve(_.find(courses, ['id', id]) || null);
      }).catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Denormalizes course data for convenience.
     *
     * @param {!Array<Course>} courses
     * @return {!Array<Course>}
     * @private
     */
    function denormalize(courses) {
      return _.map(courses, function (course) {
        return _.merge(course, {
          title: formatTitle(course),
          icon: formatIcon(course)
        });
      });
    }

    /**
     * Gets the course title.
     *
     * @param {!Course} course
     * @return {string}
     * @private
     */
    function formatTitle(course) {
      return course.number + (course.section ? '-' + course.section : '') + ' ' + course.name;
    }

    /**
     * Gets the course icon.
     *
     * @param {!Course} course
     * @return {string}
     * @private
     */
    function formatIcon(course) {
      return 'icon-' + course.icon;
    }
  }
})();
