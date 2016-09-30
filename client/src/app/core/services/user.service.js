(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('User', User);

  /** @ngInject */
  function User($q, msUtils, firebase, moment, _) {
    var cache = {};

    function inCache(key) {
      return angular.isDefined(_.get(cache, key));
    }

    function putInCache(key, value) {
      return _.get(_.set(cache, key, angular.copy(value)), key);
    }

    var service = {
      clear: clear,
      get: get,
      set: set,
      update: update
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
     * Gets a Firebase reference.
     *
     * @param {string} id
     * @return {!firebase.Ref}
     */
    function ref(id) {
      return firebase.database().ref('users').child(id);
    }

    /**
     * Gets a user.
     *
     * @param {string} id
     * @return {!Promise(?User)}
     */
    function get(id) {
      if (!id) {
        return $q.resolve(null);
      }

      if (inCache(id)) {
        return $q.resolve(cache[id]);
      }

      var deferred = $q.defer();

      ref(id).once('value')
      .then(function (snapshot) {
        deferred.resolve(putInCache(id, msUtils.oneRecordFromSnapshot(snapshot)));
      })
      .catch(function () {
        deferred.resolve(null);
      });

      return deferred.promise;
    }

    /**
     * Sets a user's data (called exactly once per user ever).
     *
     * @param {string} id
     * @param {object} data
     * @return {!Promise(!User)}
     */
    function set(id, user) {
      var deferred = $q.defer();

      user = format(user);
      user.created = moment.utc().format();

      ref(id).set(user)
      .then(function () {
        user.id = id;
        deferred.resolve(putInCache(id, user));
      })
      .catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Updates a user.
     *
     * @param {!User} user
     * @param {object} updates
     * @return {!Promise(!User)}
     */
    function update(user, updates) {
      var deferred = $q.defer();

      updates = format(updates);
      updates.updated = moment.utc().format();

      ref(user.id).update(updates)
      .then(function () {
        deferred.resolve(putInCache(user.id, angular.merge(user, updates)));
      })
      .catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Formats a user record.
     *
     * @param {!User} user
     * @private
     */
    function format(user) {
      user.anonymous = !!user.anonymous;

      if (user.profileImageUrl && user.profileImageUrl.indexOf('http:') > -1) {
        user.profileImageUrl = user.profileImageUrl.replace('http:', 'https:');
      }

      return user;
    }
  }
})();
