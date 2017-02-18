(function () {
  'use strict';

  angular
    .module('app.main.account', [
      'app.main.account.profile',
      'app.main.account.reviews'
    ])
    .config(config);

  /** @ngInject */
  function config(msNavigationServiceProvider) {
    msNavigationServiceProvider.saveItem('app_main_account', {
      title: 'Account',
      group: true,
      weight: 1
    });
  }
})();
