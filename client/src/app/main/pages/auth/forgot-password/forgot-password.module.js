(function () {
  'use strict';

  angular
    .module('app.main.pages.auth.forgot-password', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {
    $stateProvider.state('app.main_pages_auth_forgot-password', {
      url: '/forgot-password?e',
      views: {
        'main@': {
          templateUrl: 'app/core/layouts/content-only.html',
          controller: 'MainController as vm'
        },
        'content@app.main_pages_auth_forgot-password': {
          templateUrl: 'app/main/pages/auth/forgot-password/forgot-password.html',
          controller: 'ForgotPasswordController as vm',
          resolve: {
            user: (Auth) => Auth.waitForUser()
          }
        }
      },
      bodyClass: 'main-pages-auth-forgot-password'
    });
  }
})();
