(function () {
  'use strict';

  angular
    .module('app.quick-panel')
    .controller('QuickPanelController', QuickPanelController);

  /** @ngInject */
  function QuickPanelController($scope, $state, $mdSidenav, Review, reviews, gtConfig) {
    const vm = this;

    // Data

    vm.reviews = reviews;

    // Methods

    vm.goTo = goTo;

    //////////

    init();

    function init() {
      const listeners = [
        $scope.$on(gtConfig.code.event.REVIEW_CREATED, onReviewChanged),
        $scope.$on(gtConfig.code.event.REVIEW_UPDATED, onReviewChanged),
        $scope.$on(gtConfig.code.event.REVIEW_REMOVED, onReviewChanged)
      ];

      $scope.$on('$destroy', () => {
        angular.forEach(listeners, (listener) => listener());
      });
    }

    async function onReviewChanged($event, review) {
      if (Review.isRecent(review)) {
        vm.reviews = await Review.getRecent();
      }
    }

    async function goTo(review) {
      await $mdSidenav('quick-panel').toggle();
      $state.go('app.main_reviews_course', { id: review.course, rid: review._id });
    }
  }
})();
