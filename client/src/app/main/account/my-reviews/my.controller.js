(function () {
  'use strict';

  angular
    .module('app.account.reviews')
    .controller('ReviewsMyController', ReviewsMyController);

  /** @ngInject */
  function ReviewsMyController(reviews) {
    var vm = this;

    // Data

    vm.reviews = reviews;

    // Methods

    //////////

  }
})();
