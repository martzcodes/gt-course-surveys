(function () {
  'use strict';

  angular
    .module('app.reviews.course')
    .run(runBlock);

  /** @ngInject */
  function runBlock($timeout, msNavigationService, Course, _) {
    $timeout(function () {
      Course.all().then(function (courses) {
        _.forEach(courses, function (course, index) {
          index++;
          msNavigationService.saveItem('reviews.course.' + index, {
            title:       course.title,
            icon:        course.icon,
            tooltip:     course.name,
            state:       'app.reviews_course',
            stateParams: { id: course.id },
            weight:      (2200 + index) / 1000
          });
        });
      });
    });
  }
})();
