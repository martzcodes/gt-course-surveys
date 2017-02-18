(function () {
  'use strict';

  angular
    .module('app.main.about', [
      'app.main.about.faq',
      'app.main.about.donate'
    ])
    .config(config);

  /** @ngInject */
  function config(msNavigationServiceProvider) {
    msNavigationServiceProvider.saveItem('app_main_about', {
      title: 'About',
      group: true,
      weight: 4
    });
  }
})();
