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
  function ProgressBarController() {
    var vm = this;

    // Data

    /**
     * Value in the range.
     *
     * @type {number}
     */
    vm.value = vm.value || 0;

    /**
     * Maximum of the range.
     *
     * @type {number}
     */
    vm.max = vm.max || 100;

    /**
     * Percentage of value in range.
     *
     * @type {number}
     */
    vm.percent = Math.round((vm.value * 100.0) / vm.max) + '%';

    // Methods

    //////////
  }
})();
