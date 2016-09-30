(function () {
  'use strict';

  angular
    .module('app.reviews.all', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
    $stateProvider.state('app.reviews_all', {
      url: '/reviews',
      views: {
        'content@app': {
          templateUrl: 'app/main/reviews/all-reviews/all.html',
          controller: 'ReviewsAllController as vm'
        }
      },
      resolve: {
        courses: function (Course) {
          return Course.all();
        },
        aggregations: function (Aggregation) {
          return Aggregation.all();
        }
      },
      bodyClass: 'reviews-all'
    });

    $translatePartialLoaderProvider.addPart('app/main/reviews/all-reviews');

    msNavigationServiceProvider.saveItem('reviews.all', {
      title: 'All Reviews',
      translate: 'ALL_REVIEWS.NAV',
      icon: 'icon-table-large',
      state: 'app.reviews_all',
      weight: 2.1
    });
  }
})();
