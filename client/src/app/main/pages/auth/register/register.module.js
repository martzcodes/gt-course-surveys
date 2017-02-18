(function () {
  'use strict';

  angular
    .module('app.main.pages.auth.register', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {
    $stateProvider.state('app.main_pages_auth_register', {
      url: '/register',
      views: {
        'main@': {
          templateUrl: 'app/core/layouts/content-only.html',
          controller: 'MainController as vm'
        },
        'content@app.main_pages_auth_register': {
          templateUrl: 'app/main/pages/auth/register/register.html',
          controller: 'RegisterController as vm',
          resolve: {
            user: (Auth) => Auth.waitForUser()
          }
        }
      },
      bodyClass: 'main-pages-auth-register'
    });
  }
})();
