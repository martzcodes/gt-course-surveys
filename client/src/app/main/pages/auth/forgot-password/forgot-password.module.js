(function () {
  'use strict';

  angular
    .module('app.pages.auth.forgot-password', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider) {
    $stateProvider
    .state('app.pages_auth_forgot-password', {
      url: '/pages/auth/forgot-password?e',
      views: {
        'main@': {
          templateUrl: 'app/core/layouts/content-only.html',
          controller: 'MainController as vm'
        },
        'content@app.pages_auth_forgot-password': {
          templateUrl: 'app/main/pages/auth/forgot-password/forgot-password.html',
          controller: 'ForgotPasswordController as vm',
          resolve: {
            user: function (Auth) {
              return Auth.waitForCurrentUser();
            }
          }
        }
      },
      bodyClass: 'pages-auth-forgot-password'
    });

    $translatePartialLoaderProvider.addPart('app/main/pages/auth/forgot-password');
  }
})();
