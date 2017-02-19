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
      get
    };

    return service;

    //////////

    async function all(unknown = false) {
      const filter = (s) => unknown || !s.isUnknown;

      if (cache.info().size > 0) {
        return _.filter(cache.values(), filter);
      }

      const snapshot = await firebase.database().ref(ini).once('value');
      const semesters = _denormalize(Util.many(snapshot));

      _.forEach(semesters, (s) => cache.put(s._id, s));

      return _.filter(semesters, filter);
    }

    async function get(id) {
      if (cache.get(id)) {
        return cache.get(id);
      }
      return _.find(await all(), ['_id', id]) || null;
    }

    function _denormalize(semesters) {
      return _.map(semesters, (semester) => _.assign({}, semester, {
        name: _formatName(semester),
        isUnknown: _formatIsUnknown(semester)
      }));
    }

    function _formatName(semester) {
      if (_formatIsUnknown(semester)) {
        return 'Unknown';
      }
      const season = seasons[semester.season];
      const year = semester.year;
      return `${season} ${year}`;
    }

    function _formatIsUnknown(semester) {
      return semester._id === '0000-0';
    }
  }
})();
