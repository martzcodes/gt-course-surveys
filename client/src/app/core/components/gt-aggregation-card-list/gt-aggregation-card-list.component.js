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
  function AggregationCardListController($scope, $timeout, Aggregation, gtConfig) {
    const vm = this;
    const listeners = [];

    // Data

    vm.aggregation = vm.aggregation || Aggregation.none();

    // Methods

    vm.$onInit = init;
    vm.$onDestroy = destroy;

    //////////

    function init() {
      listeners.push($scope.$on(gtConfig.code.event.REVIEW_CREATED, onReviewChanged));
      listeners.push($scope.$on(gtConfig.code.event.REVIEW_UPDATED, onReviewChanged));
      listeners.push($scope.$on(gtConfig.code.event.REVIEW_REMOVED, onReviewChanged));
    }

    function destroy() {
      angular.forEach(listeners, (listener) => {
        listener();
      });
    }

    async function onReviewChanged($event, review) {
      Aggregation.bust();

      $timeout(async() => {
        vm.aggregation = await Aggregation.get(review.course);
        vm.aggregation = vm.aggregation || Aggregation.none();
      }, 100);
    }
  }
})();
