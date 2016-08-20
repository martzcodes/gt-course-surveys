(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ReviewDialogController', ReviewDialogController);

  /** @ngInject */
  function ReviewDialogController($mdDialog, review, courses, semesters, _) {
    var vm = this;

    // Data

    /**
     * Whether editing an existing review (true) or creating a new one.
     *
     * @type {booelan}
     */
    vm.editing = !!review.created;

    /**
     * Review to edit.
     *
     * @type {!Review}
     */
    vm.review = review ? angular.copy(review) : {};

    /**
     * Courses.
     *
     * @type {!Array<Course>}
     */
    vm.courses = courses;

    /**
     * Semesters.
     *
     * @type {!Array<Semester>}
     */
    vm.semesters = semesters;

    /**
     * Difficulties.
     *
     * @type {!Array<number>}
     */
    vm.difficulties = [1,2,3,4,5];

    /**
     * Ratings.
     *
     * @type {!Array<number>}
     */
    vm.ratings = [1,2,3,4,5];

    // Methods

    vm.hide = hide;
    vm.cancel = cancel;

    //////////

    /**
     * Hides.
     */
    function hide() {
      vm.review.text = _.chain(vm.review.text)
        .trim()
        .replace(/\./g, '. ')
        .replace(/,/g, ', ')
        .replace(/[ ]+/g, ' ')
        .replace(/\ \./g, '.')
        .trim()
        .value();

      $mdDialog.hide(vm.review);
    }

    /**
     * Cancels.
     */
    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
