(function () {
  'use strict';

  angular
    .module('app.main.reviews.course')
    .controller('ReviewsCourseController', ReviewsCourseController);

  /** @ngInject */
  function ReviewsCourseController(
    $rootScope,
    $scope,
    $timeout,
    $interval,
    $state,
    $stateParams,
    $mdToast,
    $mdDialog,

    Util,
    Aggregation,
    Review,
    Course,
    Semester,

    course,
    reviews,
    aggregation,

    eventCode) {
    const vm = this;

    // Data

    vm.working = false;
    vm.course = course;
    vm.reviews = reviews;
    vm.aggregation = aggregation || Aggregation.none();

    // Methods

    vm.scroll = scroll;
    vm.publish = publish;

    //////////

    init();

    function init() {
      let initializing = true;

      const watch = $scope.$watch('vm.aggregation', () => {
        if (initializing) {
          $timeout(() => { initializing = false; });
        } else {
          _checkForUpdatesByOthers();
        }
      });

      $scope.$on('$destroy', () => {
        watch();
      });
    }

    function scroll() {
      const id = $stateParams.rid;
      if (id && _.find(vm.reviews, ['_id', id])) {
        $timeout(() => {
          _scrollTo(id);
        });
      }
    }

    function _scrollTo(id) {
      const targetOffsetTop = 76;

      const content = angular.element('#content').scrollTop(0);
      const reviewCard = angular.element(`[data-rid="${id}"]`);

      const step = 40;
      let scrollTopChanged = true;

      const interval = $interval(() => {
        const contentScrollTop = Math.round(content.scrollTop());
        const reviewCardOffsetTop = Math.round(reviewCard.offset().top);

        if (reviewCardOffsetTop === targetOffsetTop || !scrollTopChanged) {
          $interval.cancel(interval);

          $state.transitionTo($state.current, { id: $stateParams.id, rid: null }, { notify: false });
        } else if (reviewCardOffsetTop < targetOffsetTop) {
          // Needs to increase to targetOffsetTop, meaning contentScrollTop needs to decrease
          content.scrollTop(contentScrollTop - Math.min(step, targetOffsetTop - reviewCardOffsetTop));
        } else {
          // Needs to decrease to targetOffsetTop, meaning contentScrollTop needs to increase
          content.scrollTop(contentScrollTop + Math.min(step, reviewCardOffsetTop - targetOffsetTop));
        }

        scrollTopChanged = (Math.round(content.scrollTop()) !== contentScrollTop);
      }, 25);
    }

    async function _checkForUpdatesByOthers() {
      if (vm.working) {
        return;
      }

      const serverHash = vm.aggregation.hash;
      const clientHash = Review.has(vm.reviews);

      if (serverHash !== clientHash) {
        vm.working = true;
        try {
          vm.reviews = await Review.getByCourse(course._id);
        } catch (error) {
          // silent failure
        }
        vm.working = false;
      }
    }

    async function publish($event) {
      try {
        const toPush = await $mdDialog.show({
          controller: 'ReviewDialogController as vm',
          templateUrl: 'app/core/dialogs/gt-review/gt-review.html',
          parent: angular.element('body'),
          targetEvent: $event,
          clickOutsideToClose: true,
          locals: {
            review: {
              course: vm.course._id
            }
          },
          resolve: {
            courses: Course.all,
            semesters: Semester.all
          }
        });

        const pushed = await Review.push(toPush);
        vm.reviews.push(pushed);

        $rootScope.$broadcast(eventCode.REVIEW_CREATED, pushed);

        Util.toast('Published.');
      } catch (error) {
        Util.toast(error);
      }
    }
  }
})();
