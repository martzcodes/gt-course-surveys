(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Semester', Semester);

  /** @ngInject */
  function Semester(CacheFactory, Util) {
    const ini = 'SEM';
    const cache = CacheFactory(ini);

    const seasons = {
      1: 'Spring',
      2: 'Summer',
      3: 'Fall'
    };

    const service = {
      all,
      get,
      isUnknown
    };

    return service;

    //////////

    function isUnknown(semester) {
      return semester._id === '0000-0';
    }

    async function all() {
      if (cache.info().size > 0) {
        return cache.values();
      }

      const snapshot = await firebase.database().ref(ini).once('value');
      const semesters = _denormalize(Util.many(snapshot));

      _.forEach(semesters, (s) => cache.put(s._id, s));

      return semesters;
    }

    async function get(id) {
      if (cache.get(id)) {
        return cache.get(id);
      }
      return _.find(await all(), ['_id', id]) || null;
    }

    function _denormalize(semesters) {
      return _.map(semesters, (semester) => _.assign({}, semester, {
        name: _formatName(semester)
      }));
    }

    function _formatName(semester) {
      if (isUnknown(semester)) {
        return 'Unknown';
      }
      const season = seasons[semester.season];
      const year = semester.year;
      return `${season} ${year}`;
    }
  }
})();
