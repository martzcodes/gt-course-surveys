(function () {
  'use strict';

  angular
    .module('app.main.reviews.course', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    // $stateProvider.state('app.main_reviews_course', {
    //   url: '/reviews/:id?rid',
    //   views: {
    //     'content@app': {
    //       templateUrl: 'app/main/reviews/course-reviews/course.html',
    //       controller: 'ReviewsCourseController as vm'
    //     }
    //   },
    //   resolve: {
    //     user: (Auth) => Auth.waitForUser(true),
    //     course: ($stateParams, Course) => Course.get($stateParams.id),
    //     reviews: ($stateParams, Review) => Review.getByCourse($stateParams.id),
    //     aggregation: ($stateParams, Aggregation) => Aggregation.get($stateParams.id)
    //   },
    //   bodyClass: 'main-reviews-course'
    // });

    msNavigationServiceProvider.saveItem('app_main_reviews.course', {
      title: 'Course Reviews',
      icon: 'icon-view-list',
      weight: 2.2
    });
  }
})();
