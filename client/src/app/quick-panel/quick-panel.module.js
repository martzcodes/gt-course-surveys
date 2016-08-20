(function () {
  'use strict';

  angular
    .module('app.quick-panel', [])
    .config(config);

  /** @ngInject */
  function config($translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('app/quick-panel');
  }
})();
