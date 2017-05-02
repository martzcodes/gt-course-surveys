(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Course', Course);

  /** @ngInject */
  function Course(Util, Auth, Specialization, errorCode) {
    const ini = 'CRS';

    const service = {
      all,
      get
    };

    return service;

    //////////

    async function all() {
      const snapshot = await firebase.database().ref(ini).once('value');

      return _denormalize(Util.many(snapshot));
    }

    async function get(id) {
      if (!id) {
        return null;
      }

      const snapshot = await firebase.database().ref(ini)
        .child(id)
        .once('value');

      const course = Util.one(snapshot);
      if (course) {
        return (await _denormalize([course]))[0];
      }

      throw errorCode.HTTP_404;
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
