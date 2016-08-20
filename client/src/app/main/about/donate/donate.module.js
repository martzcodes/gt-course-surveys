(function () {
  'use strict';

  angular
    .module('app.about.donate', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
    $stateProvider
    .state('app.about_donate', {
      url: '/about/donate',
      views: {
        'content@app': {
          templateUrl: 'app/main/about/donate/donate.html'
        }
      },
      bodyClass: 'about-donate'
    });

    $translatePartialLoaderProvider.addPart('app/main/about/donate');

    msNavigationServiceProvider.saveItem('about.donate', {
      title: 'DONATE',
      translate: 'DONATE.NAV',
      icon: 'icon-heart',
      state: 'app.about_donate',
      weight: 4.2
    });
  }
})();
