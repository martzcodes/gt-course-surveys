(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('User', User);

  /** @ngInject */
  function User(CacheFactory, Util) {
    const ini = 'USR';
    const cache = CacheFactory(ini);

    const service = {
      get,
      set,
      update
    };

    return service;

    //////////

    function _format(entity) {
      return _.assign({}, {
        created: entity.created || moment.utc().format(),
        updated: entity.updated || moment.utc().format(),
        authProvider: entity.authProvider,
        email: entity.email,
        name: entity.name,
        profileImageUrl: _.replace(entity.profileImageUrl, 'http:', 'https:'),
        anonymous: !!entity.anonymous,
        specialization: entity.specialization || null
      });
    }

    async function get(id) {
      if (!id) {
        return null;
      }


      if (cache.get(id)) {
        return cache.get(id);
      }

      const snapshot = await firebase.database().ref(ini)
        .child(id)
        .once('value');

      return cache.put(id, Util.one(snapshot));
    }

    async function set(id, data) {
      const formatted = _format(data);
      await firebase.database().ref(ini).child(id).set(formatted);

      return cache.put(id, _.assign({}, formatted, { _id: id }));
    }

    async function update(entity, data) {
      const id = entity._id;
      const formatted = _format(entity);
      const updates = _.assign({}, formatted, data);
      await firebase.database().ref(ini).child(id).update(updates);

      return cache.put(id, _.assign({}, updates, { _id: id }));
    }
  }
})();
