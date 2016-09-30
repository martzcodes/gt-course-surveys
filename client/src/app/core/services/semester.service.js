(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Semester', Semester);

  /** @ngInject */
  function Semester($q, msUtils, firebase, _) {
    var cache = {};

    var seasons = {
      '1': 'Spring',
      '2': 'Summer',
      '3': 'Fall'
    };

    var service = {
      clear: clear,
      all: all,
      get: get,
      isUnknown: isUnknown
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
     * Determines if the semester is the 'unknown' semester.
     *
     * @param {!Semester} semester
     * @return {boolean}
     */
    function isUnknown(semester) {
      return semester.id === '0000-0';
    }

    /**
     * Gets all semesters.
     *
     * @return {!Promise(!Array<Semester>)}
     */
    function all() {
      if (!_.isEmpty(cache)) {
        return $q.resolve(_.values(cache));
      }

      var deferred = $q.defer();

      firebase
        .database()
        .ref('semesters')
        .once('value')
        .then(function (snapshot) {
          var semesters = denormalize(msUtils.manyRecordsFromSnapshot(snapshot));

          cache = _.zipObject(_.map(semesters, 'id'), semesters);

          deferred.resolve(semesters);
        })
        .catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Gets a semester.
     *
     * @param {string} id
     * @return {!Promise(?Semester)}
     */
    function get(id) {
      var cached = _.get(cache, id);
      if (cached) {
        return $q.resolve(cached);
      }

      var deferred = $q.defer();

      all().then(function (semesters) {
        deferred.resolve(_.find(semesters, ['id', id]) || null);
      }).catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Denormalizes semester data for convenience.
     *
     * @param {!Array<Semester>} semesters
     * @return {!Array<Semester>}
     * @private
     */
    function denormalize(semesters) {
      return _.map(semesters, function (semester) {
        return _.merge(semester, {
          name: formatName(semester)
        });
      });
    }

    /**
     * Gets the semester name.
     *
     * @param {!Semester} semester
     * @return {string}
     * @private
     */
    function formatName(semester) {
      if (isUnknown(semester)) {
        return 'Unknown';
      } else {
        return seasons[semester.season] + ' ' + semester.year;
      }
    }
  }
})();
