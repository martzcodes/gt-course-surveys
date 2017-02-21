(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Bot', Bot);

  /** @ngInject */
  function Bot($http, Auth, User, apiUrl) {
    const version = 'v1';

    const service = {
      conversate
    };

    return service;

    //////////

    async function conversate(query) {
      const user = await Auth.requireUser();

      const url = `${apiUrl.bot}/api/${version}`;

      const request = {
        type: 'CONVERSATE',
        data: {
          query,
          token: user.token || null
        }
      };

      const response = await $http.post(url, request);

      const token = _.get(response.data, 'data.token', null);
      if (token !== user.token) {
        await User.update(user, { token });
      }

      return _.get(response.data, 'data.message', null);
    }
  }
})();
