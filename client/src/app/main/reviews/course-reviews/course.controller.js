(function () {
  'use strict';

  angular
    .module('app.reviews.course')
    .controller('ReviewsCourseController', ReviewsCourseController);

  /** @ngInject */
  function ReviewsCourseController(
      $rootScope,
      $scope,
      $filter,
      $timeout,
      $interval,
      $q,
      $state,
      $stateParams,
      $mdToast,
      $mdDialog,

      msUtils,
      Review,
      Course,
      Semester,

      course,
      reviews,
      aggregation,

      eventCode,
      _) {
    var vm = this;
    var translate = $filter('translate');

    // Data

    /**
     * Whether there is an asynchronous operation happening.
     *
     * @type {boolean}
     */
    vm.working = false;

    /**
     * The course for which to display reviews.
     *
     * @type {!Course}
     */
    vm.course = course;

    /**
     * Course reviews.
     *
     * @type {!Array<Review>}
     */
    vm.reviews = reviews;

    /**
     * Aggregation of course reviews.
     *
     * @type {!Aggregation}
     */
    vm.aggregation = aggregation;

    // Methods

    vm.scroll = scroll;
    vm.publish = publish;

    //////////

    init();

    function init() {
      var initializing = true;

      var aggregationWatch = $scope.$watch('vm.aggregation', function () {
        if (initializing) {
          $timeout(function () { initializing = false; });
        } else {
          checkForUpdatesByOthers();
        }
      });

      $scope.$on('$destroy', function () {
        aggregationWatch();
      });
    }

    /**
     * Scrolls to a particular review if needed.
     *
     * @private
     */
    /* istanbul ignore next */
    function scroll() {
      var id = $stateParams.rid;
      if (id && _.find(vm.reviews, ['id', id])) {
        $timeout(function () {
          scrollToReview(id);
        });
      }
    }

    /**
     * Scrolls to a particular review.
     *
     * @param {string} id Review ID.
     * @private
     */
    /* istanbul ignore next */
    function scrollToReview(id) {
      var targetOffsetTop = 76;

      var content = angular.element('#content').scrollTop(0);
      var reviewCard = angular.element('[data-rid="' + id + '"]');

      var step = 40;
      var scrollTopChanged = true;

      var interval = $interval(function () {

        var contentScrollTop = Math.round(content.scrollTop());
        var reviewCardOffsetTop = Math.round(reviewCard.offset().top);

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

    /**
     * Checks if there are updates contributing to the aggregation that have not
     * been observed by the client, and if so, refreshes state.
     *
     * @private
     */
    function checkForUpdatesByOthers() {
      if (vm.working) {
        return;
      }

      var serverHash = vm.aggregation.hash;

      var clientHash = _.chain(reviews)
        .map(function (review) {
          return [review.id, review.difficulty, review.workload, review.rating];
        })
        .flatten()
        .reduce(function (hash, x) {
          /* jshint bitwise: false */
          return hash ^ msUtils.hashCode(_.toString(x));
        })
        .value();

      /* istanbul ignore else */
      if (serverHash !== clientHash) {
        vm.working = true;

        Review.getByCourse(course.id, true)
        .then(function (reviews) {
          vm.reviews = reviews;
        })
        .catch(msUtils.toast)
        .finally(function () {
          vm.working = false;
        });
      }
    }

    /**
     * Brings up the dialog to publish a review.
     *
     * @param {!jQuery.Event} $event
     */
    function publish($event) {
      $mdDialog.show({
        controller: 'ReviewDialogController as vm',
        templateUrl: 'app/core/dialogs/gt-review/gt-review.html',
        parent: angular.element('body'),
        targetEvent: $event,
        clickOutsideToClose: true,
        locals: {
          review: {
            course: vm.course.id
          }
        },
        resolve: {
          courses: Course.all,
          semesters: Semester.all
        }
      })
      .then(function (review) {
        return Review.push(review);
      })
      .then(function (review) {
        vm.reviews.push(review);

        $rootScope.$broadcast(eventCode.REVIEW_CREATED, review);

        msUtils.toast(translate('COURSE_REVIEWS.PUBLISHED'));
      })
      .catch(msUtils.toast);
    }
  }
})();
