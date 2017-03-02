(function () {
  'use strict';

  angular
    .module('app.main.timeline', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {
    $stateProvider.state('app.main_timeline', {
      url: '/timeline',
      views: {
        'main@': {
          templateUrl: 'app/core/layouts/content-only.html',
          controller: 'MainController as vm'
        },
        'content@app.main_timeline': {
          templateUrl: 'app/main/timeline/timeline.html',
          controller: 'TimelineController as vm'
        }
      },
      resolve: {
        reviews: (Review) => Review.all(100)
      },
      bodyClass: 'main-timeline'
    });
  }
})();
