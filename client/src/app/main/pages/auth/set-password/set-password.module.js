(function () {
  'use strict';

  angular
    .module('app.pages.auth.set-password', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider) {
    $stateProvider.state('app.pages_auth_set-password', {
      url: '/pages/auth/set-password?oobCode',
      views: {
        'main@': {
          templateUrl: 'app/core/layouts/content-only.html',
          controller: 'MainController as vm'
        },
        'content@app.pages_auth_set-password': {
          templateUrl: 'app/main/pages/auth/set-password/set-password.html',
          controller: 'SetPasswordController as vm',
          resolve: {
            user: function (Auth) {
              return Auth.waitForCurrentUser();
            },
            email: function (Auth, $stateParams) {
              return Auth.email.verifyPasswordResetCode($stateParams.oobCode);
            }
          }
        }
      },
      bodyClass: 'page-auth-set-password'
    });

    $translatePartialLoaderProvider.addPart('app/main/pages/auth/set-password');
  }
})();
