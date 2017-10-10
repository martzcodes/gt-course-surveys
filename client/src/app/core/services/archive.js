(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Archive', Archive);

  /** @ngInject */
  function Archive($http, gtConfig) {
    const service = {
      get
    };

    return service;

    //////////

    async function get(location) {
      const url = `${gtConfig.url.archive}/${location}.json`;
      const response = await $http.get(url);
      return _.get(response, 'data', null);
    }
  }
})();
