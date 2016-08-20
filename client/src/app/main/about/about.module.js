(function () {
  'use strict';

  angular
    .module('app.about', [
      'app.about.faq',
      'app.about.donate'
    ])
    .config(config);

  /** @ngInject */
  function config($translatePartialLoaderProvider, msNavigationServiceProvider) {
    $translatePartialLoaderProvider.addPart('app/main/about');

    msNavigationServiceProvider.saveItem('about', {
      title: 'About',
      translate: 'ABOUT.NAV',
      group: true,
      weight: 4
    });
  }
})();
