(function () {
  'use strict';

  angular
    .module('app.reviews.all')
    .controller('ReviewsAllController', ReviewsAllController);

  /** @ngInject */
  function ReviewsAllController($state, Aggregation, courses, aggregations, _) {
    var vm = this;

    // Data

    /**
     * Courses.
     *
     * @type {!Array<Course>}
     */
    vm.courses = courses;

    /**
     * Column headers.
     *
     * @type {!Array<object>}
     */
    vm.headers = [{
      key: 'department',
      translate: 'ALL_REVIEWS.DEPARTMENT',
      classes: 'w-100 text-truncate'
    },{
      key: 'number',
      translate: 'ALL_REVIEWS.NUMBER',
      classes: 'w-100 text-truncate'
    },{
      key: 'name',
      translate: 'ALL_REVIEWS.NAME',
      classes: ''
    },{
      key: 'reviews',
      translate: 'ALL_REVIEWS.REVIEWS',
      classes: 'w-100 text-truncate text-center'
    },{
      key: 'workload',
      translate: 'ALL_REVIEWS.AVG_WORKLOAD',
      classes: 'w-100 text-truncate text-center'
    },{
      key: 'difficulty',
      translate: 'ALL_REVIEWS.AVG_DIFFICULTY',
      classes: 'w-100 text-truncate text-center'
    },{
      key: 'rating',
      translate: 'ALL_REVIEWS.AVG_RATING',
      classes: 'w-100 text-truncate text-center'
    }];

    /**
     * Key used for sorting.
     *
     * @type {?string}
     */
    vm.sortKey = null;

    /**
     * Whether to sort in reverse.
     *
     * @type {?boolean}
     */
    vm.sortReverse = null;

    // Methods

    vm.sortOn = sortOn;
    vm.sortingOn = sortingOn;
    vm.goTo = goTo;

    //////////

    init();

    function init() {
      var index = _.zipObject(_.map(aggregations, 'id'), aggregations);

      angular.forEach(vm.courses, function (course) {
        var aggregation = index[course.id] || Aggregation.none();

        _.merge(course, {
          reviews:    aggregation.count,
          difficulty: aggregation.average.difficulty,
          workload:   aggregation.average.workload,
          rating:     aggregation.average.rating
        });
      });
    }

    /**
     * Sorts on a given column.
     *
     * @param {object} column
     */
    function sortOn(column) {
      if (vm.sortReverse === null) {
        vm.sortReverse = true;
      } else if (vm.sortingOn(column)) {
        vm.sortReverse = !vm.sortReverse;
      }

      vm.sortKey = column.key;
    }

    /**
     * Determines if currently sorting on a given column.
     *
     * @param {object} column
     * @return {boolean}
     */
    function sortingOn(column) {
      return column && column.key === vm.sortKey;
    }

    /**
     * Navigates to the detailed view for a given course.
     *
     * @param {!Course} course
     */
    function goTo(course) {
      $state.go('app.reviews_course', { id: course.id });
    }
  }
})();
