(function () {
  'use strict';

  angular
    .module('app.main.about.faq', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    $stateProvider.state('app.about_faq', {
      url: '/about/faq',
      views: {
        'content@app': {
          templateUrl: 'app/main/about/faq/faq.html'
        }
      },
      bodyClass: 'main-about-faq'
    });

    msNavigationServiceProvider.saveItem('app_main_about.faq', {
      title: 'FAQ',
      icon: 'icon-help-circle',
      state: 'app.about_faq',
      weight: 4.1
    });
  }
})();
