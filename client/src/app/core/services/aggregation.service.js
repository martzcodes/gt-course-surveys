(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Aggregation', Aggregation);

  /** @ngInject */
  function Aggregation($q, $http, msUtils, firebase, apiUrl) {
    var service = {
      all: all,
      get: get,
      none: none
    };

    return service;

    //////////

    /**
     * Gets all aggregations.
     *
     * @return {!Promise(!Array<Aggregation>)}
     */
    function all() {
      var deferred = $q.defer();

      firebase
        .database()
        .ref('aggregations')
        .once('value')
        .then(function (snapshot) {
          deferred.resolve(msUtils.manyRecordsFromSnapshot(snapshot));
        })
        .catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Gets an aggregation.
     *
     * @param {string} id Course ID.
     * @return {!Promise(?Aggregation)}
     */
    function get(id) {
      var deferred = $q.defer();

      function resolve(response) {
        deferred.resolve(response.data);
      }

      function reject(response) {
        deferred.reject(response.data);
      }

      $http.get(apiUrl + '/aggregation/' + id).then(resolve).catch(reject);

      return deferred.promise;
    }

    /**
     * Gets the aggregation for a course without reviews.
     *
     * @return {!Aggregation}
     */
    function none() {
      return {
        count: 0,
        average: {
          difficulty: 0,
          workload: 0,
          rating: 0
        }
      };
    }
  }
})();
