(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Logger', Logger);

  /** @ngInject */
  function Logger($log) {
    const service = {
      Type: {
        Error: 'error'
      },
      log
    };

    return service;

    //////////

    function log(type, data = null) {
      return $log.warn({ type, data });
    }

    // async function log(type, data = null) {
    //   const user = await Auth.waitForUser(true);
    //   const by = _.get(user, '_id', null);
    //   const when = moment.utc().format();
    //   const meta = { type, by, when };
    //   try {
    //     firebase.database().ref('LOG').push({ meta, data });
    //   } catch (error) {
    //     // silent failure
    //   }
    // }
  }
})();
