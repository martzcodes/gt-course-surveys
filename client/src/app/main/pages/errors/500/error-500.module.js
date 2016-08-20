(function () {
  'use strict';

  angular
    .module('app.pages.error-500', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider) {
    $stateProvider
    .state('app.pages_errors_error-500', {
      url: '/500',
      views: {
        'main@': {
          templateUrl: 'app/core/layouts/content-only.html',
          controller: 'MainController as vm'
        },
        'content@app.pages_errors_error-500': {
          templateUrl: 'app/main/pages/errors/500/error-500.html'
        }
      },
      bodyClass: 'pages-errors-error-500'
    });

    $translatePartialLoaderProvider.addPart('app/main/pages/errors/500');
  }
})();
