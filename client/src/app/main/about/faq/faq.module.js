(function () {
  'use strict';

  angular
    .module('app.about.faq', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
    $stateProvider
    .state('app.about_faq', {
      url: '/about/faq',
      views: {
        'content@app': {
          templateUrl: 'app/main/about/faq/faq.html'
        }
      },
      bodyClass: 'about-faq'
    });

    $translatePartialLoaderProvider.addPart('app/main/about/faq');

    msNavigationServiceProvider.saveItem('about.faq', {
      title: 'FAQ',
      translate: 'FAQ.NAV',
      icon: 'icon-help-circle',
      state: 'app.about_faq',
      weight: 4.1
    });
  }
})();
