(function () {
  'use strict';

  angular
    .module('app.main.pages.auth.set-password', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {
    $stateProvider.state('app.main_pages_auth_set-password', {
      url: '/set-password?oobCode',
      views: {
        'main@': {
          templateUrl: 'app/core/layouts/content-only.html',
          controller: 'MainController as vm'
        },
        'content@app.main_pages_auth_set-password': {
          templateUrl: 'app/main/pages/auth/set-password/set-password.html',
          controller: 'SetPasswordController as vm',
          resolve: {
            user: (Auth) => Auth.waitForUser(),
            email: (Auth, $stateParams) => Auth.email.verifyPasswordResetCode($stateParams.oobCode)
          }
        }
      },
      bodyClass: 'main-pages-auth-set-password'
    });
  }
})();
