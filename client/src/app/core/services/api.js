(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Api', Api);

  /** @ngInject */
  function Api($http, gtConfig) {
    const version = 'v1';

    const service = {
      post
    };

    return service;

    //////////

    async function post(type, data) {
      const url = `${gtConfig.url.server}/api/${version}`;
      const response = await $http.post(url, { type, data });
      return _.get(response.data, 'data.result', null);
    }
  }
})();
