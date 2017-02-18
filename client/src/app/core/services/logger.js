(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Logger', Logger);

  /** @ngInject */
  function Logger(Auth) {
    const service = {
      Type: {
        Error: 'error'
      },
      log
    };

    return service;

    //////////

    async function log(type, data) {
      const user = await Auth.waitForUser(true);
      const by = _.get(user, '_id', null);
      const meta = { type, by };
      try {
        firebase.database().ref('LOG').push({ meta, data });
      } catch (error) {
        // silent failure
      }
    }
  }
})();
