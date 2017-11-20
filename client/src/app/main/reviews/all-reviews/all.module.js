(function () {
  'use strict';

  angular
    .module('app.main.reviews.all', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    // $stateProvider.state('app.main_reviews_all', {
    //   url: '/reviews',
    //   views: {
    //     'content@app': {
    //       templateUrl: 'app/main/reviews/all-reviews/all.html',
    //       controller: 'ReviewsAllController as vm'
    //     }
    //   },
    //   resolve: {
    //     courses: (Course) => Course.all(),
    //     aggregations: (Aggregation) => Aggregation.all()
    //   },
    //   bodyClass: 'main-reviews-all'
    // });

    msNavigationServiceProvider.saveItem('app_main_reviews.all', {
      title: 'All Reviews',
      icon: 'icon-table-large',
      state: 'app.main_reviews_all',
      weight: 2.1
    });
  }
})();
