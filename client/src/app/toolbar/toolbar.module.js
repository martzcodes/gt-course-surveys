(function () {
  'use strict';

  angular
    .module('app.toolbar', [])
    .config(config);

  /** @ngInject */
  function config($translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('app/toolbar');
  }
})();
