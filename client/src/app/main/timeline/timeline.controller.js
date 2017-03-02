(function () {
  'use strict';

  angular
    .module('app.main.timeline')
    .controller('TimelineController', TimelineController);

  /** @ngInject */
  function TimelineController(reviews) {
    const vm = this;

    // Data

    vm.reviews = reviews;

    // Methods

    //////////
  }
})();
