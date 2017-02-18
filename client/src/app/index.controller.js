(function () {
  'use strict';

  angular
    .module('app')
    .controller('IndexController', IndexController);

  /** @ngInject */
  function IndexController(fuseTheming) {
    const vm = this;

    // Data

    vm.themes = fuseTheming.themes;

    // Methods

    //////////
  }
})();
