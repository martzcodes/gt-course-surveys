(function () {
  'use strict';

  angular
    .module('app.account', [
      'app.account.profile',
      'app.account.reviews'
    ])
    .config(config);

  /** @ngInject */
  function config($translatePartialLoaderProvider, msNavigationServiceProvider) {
    $translatePartialLoaderProvider.addPart('app/main/account');

    msNavigationServiceProvider.saveItem('account', {
      title: 'Account',
      translate: 'ACCOUNT.NAV',
      group: true,
      weight: 1
    });
  }
})();
