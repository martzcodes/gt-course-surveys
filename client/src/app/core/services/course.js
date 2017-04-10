(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Course', Course);

  /** @ngInject */
  function Course(CacheFactory, Util, Auth, Specialization, errorCode) {
    const ini = 'CRS';
    const cache = CacheFactory(ini);

    const service = {
      clear,
      all,
      get
    };

    return service;

    //////////

    function clear() {
      return cache.removeAll();
    }

    async function all() {
      if (cache.info().size > 0) {
        return cache.values();
      }

      const snapshot = await firebase.database().ref(ini).once('value');
      const courses = await _denormalize(Util.many(snapshot));

      _.forEach(courses, (c) => cache.put(c._id, c));

      return courses;
    }

    async function get(id) {
      if (cache.get(id)) {
        return cache.get(id);
      }

      const course = _.find(await all(), ['_id', id]);
      if (course) {
        return course;
      }

      throw errorCode.HTTP_404;
    }

    async function _denormalize(courses) {
      // const user = await Auth.waitForUser();

      // let spec = null;
      // if (user) {
      //   spec = await Specialization.get(user.specialization);
      // }

      return _.map(courses, (course) => _.assign({}, course, {
        title: _formatTitle(course),
        icon: _formatIcon(course),
        // core: _formatCore(course, spec),
        // elective: _formatElective(course, spec)
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
      return _.has(specialization.core, course._id);
    }

    function _formatElective(course, specialization) {
      return _.has(specialization.elective, course._id);
    }
  }
})();
