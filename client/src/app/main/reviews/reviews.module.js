(function () {
  'use strict';

  angular
    .module('app.main.reviews', [
      'app.main.reviews.all',
      'app.main.reviews.course'
    ])
    .config(config);

  /** @ngInject */
  function config(msNavigationServiceProvider) {
    msNavigationServiceProvider.saveItem('app_main_reviews', {
      title: 'Reviews',
      group: true,
      weight: 2
    });
  }
})();
