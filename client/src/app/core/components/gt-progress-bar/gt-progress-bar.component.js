(function () {
  'use strict';

  angular
    .module('app.core')
    .component('gtProgressBar', {
      templateUrl: 'app/core/components/gt-progress-bar/gt-progress-bar.html',
      controller: ProgressBarController,
      controllerAs: 'vm',
      bindings: {
        value: '<',
        max: '<'
      }
    });

  /** @ngInject */
  function ProgressBarController(Util) {
    const vm = this;

    // Data

    vm.value = vm.value || 0;
    vm.max = vm.max || 100;
    vm.percent = Util.percent(vm.value, vm.max);

    // Methods

    //////////
  }
})();
