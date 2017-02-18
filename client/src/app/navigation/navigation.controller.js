(function () {
  'use strict';

  angular
    .module('app.navigation')
    .controller('NavigationController', NavigationController);

  /** @ngInject */
  function NavigationController() {
    const vm = this;

    // Data

    vm.folded = false;

    vm.msScrollOptions = {
      suppressScrollX: true
    };

    // Methods

    vm.toggleMsNavigationFolded = toggleMsNavigationFolded;

    //////////

    function toggleMsNavigationFolded() {
      vm.folded = !vm.folded;
    }
  }
})();
