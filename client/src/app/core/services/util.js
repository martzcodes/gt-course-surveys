(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Util', Util);

  /** @ngInject */
  function Util($window, $cookies, $mdDialog, $mdToast) {
    const service = {
      toast,
      one,
      many,
      confirm,
      outdated,
      hashCode,
      percent,
      average
    };

    return service;

    //////////

    async function toast(payload) {
      const message = payload ? (payload.message || payload) : null;
      if (message && message.length) {
        await $mdToast.hide();
        await $mdToast.showSimple(message);
      }
    }

    function one(s) {
      return s.exists() ? angular.merge({ _id: s.key }, s.val()) : null;
    }

    function many(s) {
      const records = [];

      if (s && s.forEach) {
        s.forEach((snapshot) => {
          const record = one(snapshot);
          if (record) {
            records.push(record);
          }
        });
      }

      return records;
    }

    function confirm(options = {}) {
      const dialog = $mdDialog.confirm()
        .title(options.title || 'Confirm')
        .textContent(options.text || 'Are you sure? This cannot be undone.')
        .ok('OK')
        .cancel('Cancel')
        .targetEvent(options.targetEvent);

      return $mdDialog.show(dialog);
    }

    function outdated(serverVersion) {
      const toast = $mdToast.simple()
        .textContent('There is a new version of GT Course Surveys available.')
        .action('Refresh')
        .highlightAction(true)
        .hideDelay(false);

      return $mdToast.show(toast).then((response) => {
        if (response === 'ok') {
          $cookies.put('vs', serverVersion);
          $window.location.reload(true);
        }
      });
    }

    function hashCode(s) {
      let hash = 0;

      if (!angular.isString(s) || s.length === 0) {
        return hash;
      }

      for (let i = 0, l = s.length; i < l; i++) {
        hash = ((hash << 5) - hash) + s.charCodeAt(i);
        hash |= 0;
      }

      return hash;
    }

    function percent(numerator, denominator = 0) {
      if (denominator > 0) {
        return Math.abs(_.round((numerator / denominator) * 100, 1));
      }
      return 0;
    }

    function average(collection, key) {
      const items = key ? _.map(collection, key) : collection;
      if (items && items.length) {
        const numbers = _.filter(items, _.isNumber);
        if (numbers.length) {
          const total = _.sum(numbers);
          const count = numbers.length;
          return _.round(total / count, 1);
        }
      }
      return 0;
    }
  }
})();
