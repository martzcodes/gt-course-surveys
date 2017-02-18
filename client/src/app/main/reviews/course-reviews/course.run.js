(function () {
  'use strict';

  angular
    .module('app.main.reviews.course')
    .run(runBlock);

  /** @ngInject */
  function runBlock($timeout, msNavigationService, Course) {
    $timeout(async () => {
      const courses = await Course.all();
      _.forEach(courses, (course, index) => {
        index++;
        msNavigationService.saveItem(`app_main_reviews.course.${index}`, {
          title: course.title,
          icon: course.icon,
          tooltip: course.name,
          state: 'app.main_reviews_course',
          stateParams: { id: course._id },
          weight: (2200 + index) / 1000
        });
      });
    });
  }
})();
