(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Aggregation', Aggregation);

  /** @ngInject */
  function Aggregation(CacheFactory, Util) {
    const ini = 'AGG';
    const cache = CacheFactory(ini);

    const service = {
      bust,
      all,
      get,
      none
    };

    return service;

    //////////

    function bust() {
      return cache.remove('all');
    }

    async function all() {
      if (cache.get('all')) {
        return cache.get('all');
      }

      const snapshot = await firebase.database().ref(ini).once('value');
      const list = Util.many(snapshot);

      return cache.put('all', list);
    }

    async function get(id) {
      if (!id) {
        return null;
      }

      const list = await all();

      return _.find(list, ['_id', id]) || null;
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
