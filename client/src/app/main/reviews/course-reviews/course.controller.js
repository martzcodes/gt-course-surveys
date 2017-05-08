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

    gtConfig) {
    const vm = this;

    // Data

    vm.course = course;
    vm.reviews = reviews;
    vm.filters = null;
    vm.aggregation = aggregation || Aggregation.none();

    // Methods

    vm.scroll = scroll;
    vm.publish = publish;
    vm.filter = filter;

    //////////

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

    async function publish($event) {
      const dialog = {
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
      };

      try {
        const toPush = await $mdDialog.show(dialog);
        const pushed = await Review.push(toPush);
        vm.reviews.push(pushed);

        $rootScope.$broadcast(gtConfig.code.event.REVIEW_CREATED, pushed);

        Util.toast('Published.');
      } catch (error) {
        Util.toast(error);
      }
    }

    function filter($event) {
      const dialog = {
        controller: 'ReviewFilterDialogController as vm',
        templateUrl: 'app/core/dialogs/gt-review-filter/gt-review-filter.html',
        parent: angular.element('body'),
        targetEvent: $event,
        clickOutsideToClose: true,
        locals: {
          filters: vm.filters,
          reviews
        },
        resolve: {
          semesters: Semester.all
        }
      };

      $mdDialog.show(dialog).then((filters) => {
        vm.filters = filters;

        if (vm.filters) {
          vm.reviews = _.filter(reviews, (r) =>
            _.includes(vm.filters.semesters, r.semester) &&
            _.includes(vm.filters.difficulties, r.difficulty) &&
            _.includes(vm.filters.ratings, r.rating) &&
            vm.filters.workload <= r.workload);

          Util.toast('Filters applied.');
        } else {
          vm.reviews = reviews;

          Util.toast('Filters cleared.');
        }

        vm.aggregation = {
          count: vm.reviews.length,
          average: {
            difficulty: Util.average(vm.reviews, 'difficulty'),
            workload: Util.average(vm.reviews, 'workload'),
            rating: Util.average(vm.reviews, 'rating')
          }
        };
      });
    }
  }
})();
