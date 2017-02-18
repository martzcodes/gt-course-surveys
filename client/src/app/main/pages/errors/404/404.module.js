(function () {
  'use strict';

  angular
    .module('app.main.pages.errors.404', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {
    $stateProvider.state('app.main_pages_errors_404', {
      url: '/404',
      views: {
        'main@': {
          templateUrl: 'app/core/layouts/content-only.html',
          controller: 'MainController as vm'
        },
        'content@app.main_pages_errors_404': {
          templateUrl: 'app/main/pages/errors/404/404.html'
        }
      },
      bodyClass: 'main-pages-errors-404'
    });
  }
})();
