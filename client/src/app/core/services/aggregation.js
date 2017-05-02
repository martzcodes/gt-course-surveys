(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Aggregation', Aggregation);

  /** @ngInject */
  function Aggregation(Util) {
    const ini = 'AGG';

    const service = {
      all,
      get,
      none
    };

    return service;

    //////////

    async function all() {
      const snapshot = await firebase.database().ref(ini).once('value');

      return Util.many(snapshot);
    }

    async function get(id) {
      if (!id) {
        return null;
      }

      const snapshot = await firebase.database().ref(ini)
        .child(id)
        .once('value');

      return Util.one(snapshot);
    }

    function none() {
      return {
        count: 0,
        average: {
          difficulty: 0,
          workload: 0,
          rating: 0
        },
        hash: 0
      };
    }
  }
})();
