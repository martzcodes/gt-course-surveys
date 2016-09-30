(function () {
  'use strict';

  angular
    .module('app.reviews.course', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
    $stateProvider.state('app.reviews_course', {
      url: '/reviews/:id?rid',
      views: {
        'content@app': {
          templateUrl: 'app/main/reviews/course-reviews/course.html',
          controller: 'ReviewsCourseController as vm'
        }
      },
      resolve: {
        course: function ($stateParams, Course) {
          return Course.get($stateParams.id);
        },
        reviews: function ($stateParams, Review) {
          return Review.getByCourse($stateParams.id);
        },
        aggregation: function ($stateParams, Aggregation) {
          return Aggregation.get($stateParams.id);
        }
      },
      bodyClass: 'reviews-course'
    });

    $translatePartialLoaderProvider.addPart('app/main/reviews/course-reviews');

    msNavigationServiceProvider.saveItem('reviews.course', {
      title: 'Course Reviews',
      translate: 'COURSE_REVIEWS.NAV',
      icon: 'icon-view-list',
      weight: 2.2
    });
  }
})();
