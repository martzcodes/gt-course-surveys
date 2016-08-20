(function () {
  'use strict';

  angular
    .module('app.grades.course')
    .run(runBlock);

  /** @ngInject */
  function runBlock($timeout, msNavigationService, Course, _) {
    $timeout(function () {
      Course.all().then(function (courses) {
        _.forEach(courses, function (course, index) {
          index++;
          msNavigationService.saveItem('grades.course.' + index, {
            title:       course.title,
            icon:        course.icon,
            tooltip:     course.name,
            state:       'app.grades_course',
            stateParams: { id: course.id },
            weight:      (3200 + index) / 1000
          });
        });
      });
    });
  }
})();
