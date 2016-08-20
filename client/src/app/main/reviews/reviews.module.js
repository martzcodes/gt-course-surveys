(function () {
  'use strict';

  angular
    .module('app.reviews', [
      'app.reviews.all',
      'app.reviews.course'
    ])
    .config(config);

  /** @ngInject */
  function config($translatePartialLoaderProvider, msNavigationServiceProvider) {
    $translatePartialLoaderProvider.addPart('app/main/reviews');

    msNavigationServiceProvider.saveItem('reviews', {
      title: 'Reviews',
      translate: 'REVIEWS.NAV',
      group: true,
      weight: 2
    });
  }
})();
