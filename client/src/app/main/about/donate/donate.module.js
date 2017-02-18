(function () {
  'use strict';

  angular
    .module('app.main.about.donate', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    $stateProvider.state('app.about_donate', {
      url: '/about/donate',
      views: {
        'content@app': {
          templateUrl: 'app/main/about/donate/donate.html'
        }
      },
      bodyClass: 'main-about-donate'
    });

    msNavigationServiceProvider.saveItem('app_main_about.donate', {
      title: 'Donate',
      icon: 'icon-heart',
      state: 'app.about_donate',
      weight: 4.2
    });
  }
})();
