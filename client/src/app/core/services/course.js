(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Course', Course);

  /** @ngInject */
  function Course(CacheFactory, Util) {
    const ini = 'CRS';
    const cache = CacheFactory(ini);

    const service = {
      all,
      get
    };

    return service;

    //////////

    async function all() {
      if (cache.info().size > 0) {
        return cache.values();
      }

      const snapshot = await firebase.database().ref(ini).once('value');
      const courses = _denormalize(Util.many(snapshot));

      _.forEach(courses, (c) => cache.put(c._id, c));

      return courses;
    }

    async function get(id) {
      if (cache.get(id)) {
        return cache.get(id);
      }
      return _.find(await all(), ['_id', id]) || null;
    }

    function _denormalize(courses) {
      return _.map(courses, (course) => _.assign({}, course, {
        title: _formatTitle(course),
        icon: _formatIcon(course)
      }));
    }

    function _formatTitle(course) {
      if (course.section) {
        return `${course.number}-${course.section} ${course.name}`;
      }
      return `${course.number} ${course.name}`;
    }

    function _formatIcon(course) {
      return `icon-${course.icon}`;
    }
  }
})();
