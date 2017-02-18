(function () {
  'use strict';

  angular
    .module('app.main.account.profile', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    $stateProvider.state('app.main_account_profile', {
      url: '/account/profile',
      views: {
        'content@app': {
          templateUrl: 'app/main/account/profile/profile.html',
          controller: 'ProfileController as vm'
        }
      },
      resolve: {
        user: (Auth) => Auth.requireUser()
      },
      bodyClass: 'main-account-profile'
    });

    msNavigationServiceProvider.saveItem('app_main_account.profile', {
      title: 'Profile',
      icon: 'icon-account',
      state: 'app.main_account_profile',
      weight: 1.1
    });
  }
})();
