(function () {
  'use strict';

  angular
    .module('app.main.pages.auth.login', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {
    $stateProvider.state('app.main_pages_auth_login', {
      url: '/login?e&p',
      views: {
        'main@': {
          templateUrl: 'app/core/layouts/content-only.html',
          controller: 'MainController as vm'
        },
        'content@app.main_pages_auth_login': {
          templateUrl: 'app/main/pages/auth/login/login.html',
          controller: 'LoginController as vm',
          resolve: {
            user: (Auth) => Auth.waitForUser()
          }
        }
      },
      bodyClass: 'main-pages-auth-login'
    });
  }
})();
