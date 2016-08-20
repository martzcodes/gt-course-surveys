(function () {
  'use strict';

  angular
    .module('app.navigation')
    .controller('NavigationController', NavigationController);

  /** @ngInject */
  function NavigationController() {
    var vm = this;

    // Data

    vm.folded = false;
    vm.msScrollOptions = {
      suppressScrollX: true
    };

    // Methods

    vm.toggleMsNavigationFolded = toggleMsNavigationFolded;

    //////////

    /**
     * Toggles the navigation sidebar folded/unfolded.
     */
    function toggleMsNavigationFolded() {
      vm.folded = !vm.folded;
    }
  }
})();
