(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ReviewDialogController', ReviewDialogController);

  /** @ngInject */
  function ReviewDialogController($mdDialog, review, courses, semesters) {
    const vm = this;

    // Data

    vm.editing = !!review.created;
    vm.review = angular.copy(review);
    vm.courses = courses;
    vm.semesters = semesters;
    vm.difficulties = [1, 2, 3, 4, 5];
    vm.ratings = [1, 2, 3, 4, 5];

    // Methods

    vm.hide = hide;
    vm.cancel = cancel;

    //////////

    function hide() {
      vm.review.text = _.chain(vm.review.text)
        .trim()
        .replace(/\./g, '. ')     // periods must be followed by a space
        .replace(/,/g, ', ')      // commas  must be followed by a space
        .replace(/[ ]+/g, ' ')    // no more than one space in a sequence
        .replace(/[ ]+,/g, ',')   // commas  w/preceding space(s)
        .replace(/[ ]+\./g, '.')  // periods w/preceding space(s)
        .trim()
        .value();

      $mdDialog.hide(vm.review);
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
