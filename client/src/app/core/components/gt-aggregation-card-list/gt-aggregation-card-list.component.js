(function () {
  'use strict';

  angular
    .module('app.core')
    .component('gtAggregationCardList', {
      templateUrl: 'app/core/components/gt-aggregation-card-list/gt-aggregation-card-list.html',
      controller: AggregationCardListController,
      controllerAs: 'vm',
      bindings: {
        aggregation: '='
      }
    });

  /** @ngInject */
  function AggregationCardListController($scope, Aggregation, eventCode) {
    var vm = this;
    var reviewChangeListeners = [];

    // Data

    /**
     * Aggregation of course reviews.
     *
     * @type {!Aggregation}
     */
    vm.aggregation = vm.aggregation || Aggregation.none();

    // Methods

    vm.$onInit = init;
    vm.$onDestroy = destroy;

    //////////

    /**
     * Registers event listeners.
     *
     * @private
     */
    function init() {
      reviewChangeListeners.push($scope.$on(eventCode.REVIEW_CREATED, handleReviewChange));
      reviewChangeListeners.push($scope.$on(eventCode.REVIEW_UPDATED, handleReviewChange));
      reviewChangeListeners.push($scope.$on(eventCode.REVIEW_REMOVED, handleReviewChange));
    }

    /**
     * Releases event listeners.
     *
     * @private
     */
    function destroy() {
      angular.forEach(reviewChangeListeners, function (listener) {
        listener();
      });
    }

    /**
     * Handles a review change by refreshing the aggregation for the review's course.
     *
     * @param {*} $event
     * @param {!Review} review
     */
    function handleReviewChange($event, review) {
      Aggregation.get(review.course).then(function (aggregation) {
        vm.aggregation = aggregation;
      });
    }
  }
})();
