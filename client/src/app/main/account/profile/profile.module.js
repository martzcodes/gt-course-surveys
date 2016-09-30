(function () {
  'use strict';

  angular
    .module('app.account.profile', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
    $stateProvider.state('app.account_profile', {
      url: '/account/profile',
      views: {
        'content@app': {
          templateUrl: 'app/main/account/profile/profile.html',
          controller: 'ProfileController as vm'
        }
      },
      resolve: {
        user: function (Auth) {
          return Auth.requireCurrentUserData();
        }
      },
      bodyClass: 'account-profile'
    });

    $translatePartialLoaderProvider.addPart('app/main/account/profile');

    msNavigationServiceProvider.saveItem('account.profile', {
      title: 'Profile',
      translate: 'PROFILE.NAV',
      icon: 'icon-account',
      state: 'app.account_profile',
      weight: 1.1
    });
  }
})();
