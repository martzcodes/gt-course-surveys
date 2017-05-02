(function () {
  'use strict';

  angular
    .module('app.main.reviews.all')
    .controller('ReviewsAllController', ReviewsAllController);

  /** @ngInject */
  function ReviewsAllController($state, Aggregation, courses, aggregations) {
    const vm = this;

    // Data

    vm.courses = courses;

    vm.headers = [{
      key: 'department',
      title: 'Dept.',
      classes: 'w-100 text-truncate'
    }, {
      key: 'number',
      title: 'Number',
      classes: 'w-100 text-truncate'
    }, {
      key: 'name',
      title: 'Name',
      classes: ''
    }, {
      key: 'reviews',
      title: 'Reviews',
      classes: 'w-100 text-truncate text-center'
    }, {
      key: 'workload',
      title: 'Avg. Work.',
      classes: 'w-100 text-truncate text-center'
    }, {
      key: 'difficulty',
      title: 'Avg. Dif.',
      classes: 'w-100 text-truncate text-center'
    }, {
      key: 'rating',
      title: 'Avg. Rating',
      classes: 'w-100 text-truncate text-center'
    }];

    vm.sortKey = null;

    vm.sortReverse = null;

    // Methods

    vm.sortOn = sortOn;
    vm.sortingOn = sortingOn;
    vm.goTo = goTo;

    //////////

    init();

    function init() {
      const index = _.zipObject(_.map(aggregations, '_id'), aggregations);

      angular.forEach(vm.courses, (course) => {
        const aggregation = index[course._id] || Aggregation.none();

        _.merge(course, {
          reviews: aggregation.count,
          difficulty: aggregation.average.difficulty,
          workload: aggregation.average.workload,
          rating: aggregation.average.rating
        });
      });
    }

    function sortOn(column) {
      if (vm.sortReverse === null) {
        vm.sortReverse = true;
      } else if (vm.sortingOn(column)) {
        vm.sortReverse = !vm.sortReverse;
      }
      vm.sortKey = column.key;
    }

    function sortingOn(column) {
      return column && column.key === vm.sortKey;
    }

    function goTo(course) {
      $state.go('app.main_reviews_course', { id: course._id });
    }
  }
})();
