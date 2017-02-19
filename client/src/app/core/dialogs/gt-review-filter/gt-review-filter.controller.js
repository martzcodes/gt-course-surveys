(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('ReviewFilterDialogController', ReviewFilterDialogController);

  /** @ngInject */
  function ReviewFilterDialogController($mdDialog, filters, semesters, reviews) {
    const vm = this;

    // Data

    vm.filters = filters || {
      semesters: _.map(semesters, '_id'),
      difficulties: [1, 2, 3, 4, 5],
      ratings: [1, 2, 3, 4, 5],
      workload: 0
    };

    vm.options = {
      semesters,
      difficulties: [1, 2, 3, 4, 5],
      ratings: [1, 2, 3, 4, 5]
    };

    vm.reviews = {
      semesters: _.chain(reviews).map('semester').uniq().sort().value(),
      difficulties: _.chain(reviews).map('difficulty').uniq().sort().value(),
      ratings: _.chain(reviews).map('rating').uniq().sort().value(),
      workload: _.chain(reviews).map('workload').max().value()
    };

    // Methods

    vm.exists = exists;
    vm.toggle = toggle;
    vm.clear = clear;
    vm.hide = hide;
    vm.cancel = cancel;

    //////////

    function exists(collection, item) {
      return _.includes(collection, item);
    }

    function toggle(collection, item) {
      const index = collection.indexOf(item);
      if (index >= 0) {
        _.pullAt(collection, index);
      } else {
        collection.push(item);
      }
    }

    function clear() {
      $mdDialog.hide(null);
    }

    function hide() {
      $mdDialog.hide(vm.filters);
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
