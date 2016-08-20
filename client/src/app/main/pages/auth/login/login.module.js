(function () {
  'use strict';

  angular
    .module('app.pages.auth.login', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider) {
    $stateProvider
    .state('app.pages_auth_login', {
      url: '/pages/auth/login?e&p',
      views: {
        'main@': {
          templateUrl: 'app/core/layouts/content-only.html',
          controller: 'MainController as vm'
        },
        'content@app.pages_auth_login': {
          templateUrl: 'app/main/pages/auth/login/login.html',
          controller: 'LoginController as vm',
          resolve: {
            user: function (Auth) {
              return Auth.waitForCurrentUser();
            }
          }
        }
      },
      bodyClass: 'pages-auth-login'
    });

    $translatePartialLoaderProvider.addPart('app/main/pages/auth/login');
  }
})();
