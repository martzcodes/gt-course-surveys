(function () {
  'use strict';

  angular
    .module('app.core')
    .run(runBlock);

  /** @ngInject */
  function runBlock(fuseGenerator) {
    fuseGenerator.generate();
  }
})();
