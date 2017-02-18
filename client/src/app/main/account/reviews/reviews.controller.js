(function () {
  'use strict';

  angular
    .module('app.main.account.reviews')
    .controller('MyReviewsController', MyReviewsController);

  /** @ngInject */
  function MyReviewsController(reviews) {
    const vm = this;

    // Data

    vm.reviews = reviews;

    // Methods

    //////////
  }
})();
