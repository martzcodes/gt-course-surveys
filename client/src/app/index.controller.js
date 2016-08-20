(function () {
  'use strict';

  angular
    .module('app')
    .controller('IndexController', IndexController);

  /** @ngInject */
  function IndexController(fuseTheming) {
    var vm = this;

    // Data

    vm.themes = fuseTheming.themes;

    // Methods

    //////////
  }
})();
