(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Course', Course);

  /** @ngInject */
  function Course(CacheFactory, Util, Auth, Specialization, gtConfig) {
    const ini = 'CRS';
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
      const list = await _denormalize(Util.many(snapshot));

      return cache.put('all', list);
    }

    async function get(id) {
      if (!id) {
        return null;
      }

      const list = await all();
      const course = _.find(list, ['_id', id]);
      if (!course) {
        throw gtConfig.code.error.HTTP_404;
      }

      return course;
    }

    async function _denormalize(courses) {
      const user = await Auth.waitForUser();
      const spec = await Specialization.get(_.get(user, 'specialization'))
      return _.map(courses, (course) => _.assign({}, course, {
        title: _formatTitle(course),
        icon: _formatIcon(course),
        core: _formatCore(course, spec),
        elective: _formatElective(course, spec)
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

    function _formatCore(course, specialization) {
      return _.has(specialization, ['core', course._id]);
    }

    function _formatElective(course, specialization) {
      return _.has(specialization, ['elective', course._id]);
    }
  }
})();
