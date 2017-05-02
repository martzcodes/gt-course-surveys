(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Specialization', Specialization);

  /** @ngInject */
  function Specialization(Util) {
    const ini = 'SPC';

    const service = {
      all,
      get
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
  }
})();
