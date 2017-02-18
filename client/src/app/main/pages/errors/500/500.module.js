(function () {
  'use strict';

  angular
    .module('app.main.pages.errors.500', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {
    $stateProvider.state('app.main_pages_errors_500', {
      url: '/500',
      views: {
        'main@': {
          templateUrl: 'app/core/layouts/content-only.html',
          controller: 'MainController as vm'
        },
        'content@app.main_pages_errors_500': {
          templateUrl: 'app/main/pages/errors/500/500.html'
        }
      },
      bodyClass: 'main-pages-errors-500'
    });
  }
})();
