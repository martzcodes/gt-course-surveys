(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('msUtils', msUtils);

  /** @ngInject */
  function msUtils($window, $filter, $q, $mdDialog, $mdToast, bowser) {
    var translate = $filter('translate');

    var service = {
      isMobile: isMobile,
      toast: toast,
      oneRecordFromSnapshot: oneRecordFromSnapshot,
      manyRecordsFromSnapshot: manyRecordsFromSnapshot,
      confirm: confirm,
      hashCode: hashCode
    };

    return service;

    //////////

    /**
     * Determines if current device is a mobile device.
     *
     * @return {boolean}
     */
    function isMobile() {
      return bowser.mobile || bowser.tablet;
    }

    /**
     * Shows a simple toast.
     *
     * @param {?object|?string} payload
     * @return {!Promise()} Resolved when toast becomes hidden.
     */
    function toast(payload) {
      var message = payload ? (payload.message || payload) : null;
      if (!message || !message.length) {
        return $q.resolve();
      }

      var deferred = $q.defer();

      $mdToast.hide().then(function () {
        return $mdToast.showSimple(message);
      }).finally(deferred.resolve);

      return deferred.promise;
    }

    /**
     * Extracts one record from a Firebase snapshot.
     *
     * @param {!Snapshot} s
     * @return {?Record}
     */
    function oneRecordFromSnapshot(s) {
      return s.exists() ? angular.merge({ id: s.key }, s.val()) : null;
    }

    /**
     * Extracts multiple records from a Firebase snapshot.
     *
     * @param {!Snapshot} s
     * @return {!Array<Record>}
     */
    function manyRecordsFromSnapshot(s) {
      var records = [];

      s.forEach(function (childSnapshot) {
        var one = oneRecordFromSnapshot(childSnapshot);
        if (one) {
          records.push(one);
        }
      });

      return records;
    }

    /**
     * Prompts user to confirm an action.
     *
     * @param {!jQuery.Event} $event
     * @param {string=} title
     * @param {string=} text
     * @return {!Promise()} Resolves if user confirms.
     */
    function confirm($event, title, text) {
      return $mdDialog.show(
        $mdDialog.confirm()
          .title(title || translate('CORE.CONFIRM'))
          .textContent(text || translate('CORE.SURE'))
          .ok(translate('CORE.OK'))
          .cancel(translate('CORE.CANCEL'))
          .targetEvent($event)
      );
    }

    /**
     * Calculates the hash code for a string.
     *
     * @param {string} s
     * @return {number} 32-bit integer.
     */
    function hashCode(s) {
      var hash = 0, i, char, l;

      if (!angular.isString(s) || s.length === 0) {
        return hash;
      }

      for (i = 0, l = s.length; i < l; i++) {
        char  = s.charCodeAt(i);
        hash  = ((hash << 5) - hash) + char;
        hash |= 0;
      }

      return hash;
    }
  }
}());
