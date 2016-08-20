(function () {
  'use strict';

  angular
    .module('app.core')
    .component('gtReviewCard', {
      templateUrl: 'app/core/components/gt-review-card/gt-review-card.html',
      controller: ReviewCardController,
      controllerAs: 'vm',
      bindings: {
        review: '<',
        showCourseTitle: '<',
        readOnly: '<',
        onEdit: '&',
        onRemove: '&'
      }
    });

  /** @ngInject */
  function ReviewCardController($filter, Auth, _) {
    var vm = this;
    var translate = $filter('translate');
    var amDateFormat = $filter('amDateFormat');

    // Data

    /**
     * Current user.
     *
     * @type {?User}
     */
    vm.user = Auth.getCurrentUserSync();

    // Methods

    vm.createdTimeOf = createdTimeOf;
    vm.showButtons = showButtons;
    vm.edit = edit;
    vm.remove = remove;

    //////////

    /**
     * Gets the created time for a review with handling for imported ones.
     *
     * @param {!Review} review
     * @return {string}
     */
    function createdTimeOf(review) {
      if (_.includes([review.created, review.updated], '2015-11-05T06:00:00+00:00')) {
        return translate('CORE.IMPORTED');
      } else {
        return amDateFormat(review.created, 'M/D/YY, h:mm a');
      }
    }

    /**
     * Determines whether EDIT/REMOVE buttons should be available.
     *
     * @return {boolean}
     */
    function showButtons() {
      return vm.user && vm.user.id === vm.review.author;
    }

    /**
     * Handles the edit click.
     *
     * @param {!jQuery.Event} $event,
     * @param {!Review} review
     */
    function edit($event, review) {
      vm.onEdit({ event: $event, review: review });
    }

    /**
     * Handles the remove click.
     *
     * @param {!jQuery.Event} $event,
     * @param {!Review} review
     */
    function remove($event, review) {
      vm.onRemove({ event: $event, review: review });
    }
  }
})();
