(function () {
  'use strict';

  angular
    .module('app.quick-panel')
    .controller('QuickPanelController', QuickPanelController);

  /** @ngInject */
  function QuickPanelController($scope, $state, $mdSidenav, Review, reviews, gtConfig) {
    const vm = this;
    const listeners = [];

    // Data

    vm.reviews = reviews;

    // Methods

    vm.goTo = goTo;

    //////////

    init();

    function init() {
      listeners.push($scope.$on(gtConfig.code.event.REVIEW_CREATED, onReviewCreated));
      listeners.push($scope.$on(gtConfig.code.event.REVIEW_UPDATED, onReviewUpdated));
      listeners.push($scope.$on(gtConfig.code.event.REVIEW_REMOVED, onReviewRemoved));

      $scope.$on('$destroy', () => {
        angular.forEach(listeners, (listener) => {
          listener();
        });
      });
    }

    function onReviewCreated($event, review) {
      if (Review.isRecent(review)) {
        vm.reviews.unshift(review);
      }
    }

    function onReviewUpdated($event, review) {
      if (Review.isRecent(review)) {
        const index = _.findIndex(vm.reviews, ['_id', review._id]);
        if (index >= 0) {
          vm.reviews[index] = review;
        }
      }
    }

    function onReviewRemoved($event, review) {
      if (Review.isRecent(review)) {
        _.remove(vm.reviews, ['_id', review._id]);
      }
    }

    async function goTo(review) {
      await $mdSidenav('quick-panel').toggle();
      $state.go('app.main_reviews_course', { id: review.course, rid: review._id });
    }
  }
})();
