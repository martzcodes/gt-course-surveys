(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Specialization', Specialization);

  /** @ngInject */
  function Specialization(CacheFactory, Util) {
    const ini = 'SPC';
    const cache = CacheFactory(ini);

    const service = {
      all,
      get
    };

    return service;

    //////////

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
  }
})();
