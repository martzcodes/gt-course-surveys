(function () {
  'use strict';

  angular
    .module('app.main.grades.all')
    .controller('GradesAllController', GradesAllController);

  /** @ngInject */
  function GradesAllController($state, Grade, courses, grades) {
    const vm = this;

    // Data

    vm.courses = courses;

    vm.mode = '%';

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
      key: '"#a"',
      text: '# A',
      classes: 'w-100 text-center',
      mode: '#'
    }, {
      key: '"#b"',
      text: '# B',
      classes: 'w-100 text-center',
      mode: '#'
    }, {
      key: '"#c"',
      text: '# C',
      classes: 'w-100 text-center',
      mode: '#'
    }, {
      key: '"#d"',
      text: '# D',
      classes: 'w-100 text-center',
      mode: '#'
    }, {
      key: '"#w"',
      text: '# W',
      classes: 'w-100 text-center',
      mode: '#'
    }, {
      key: '"%a"',
      text: '% A',
      classes: 'w-100 text-center',
      mode: '%'
    }, {
      key: '"%b"',
      text: '% B',
      classes: 'w-100 text-center',
      mode: '%'
    }, {
      key: '"%c"',
      text: '% C',
      classes: 'w-100 text-center',
      mode: '%'
    }, {
      key: '"%d"',
      text: '% D',
      classes: 'w-100 text-center',
      mode: '%'
    }, {
      key: '"%w"',
      text: '% W',
      classes: 'w-100 text-center',
      mode: '%'
    }, {
      key: '"~a"',
      text: '% A',
      classes: 'w-100 text-center',
      mode: '~'
    }, {
      key: '"~b"',
      text: '% B',
      classes: 'w-100 text-center',
      mode: '~'
    }, {
      key: '"~c"',
      text: '% C',
      classes: 'w-100 text-center',
      mode: '~'
    }, {
      key: '"~d"',
      text: '% D',
      classes: 'w-100 text-center',
      mode: '~'
    }, {
      key: '"~w"',
      text: '% W',
      classes: 'w-100 text-center',
      mode: '~'
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
      angular.forEach(vm.courses, (course) => {
        // Format course grades as '#a', '#b', ... for sorting if available.
        // Otherwise, fill with zeros for usability.

        const courseGrades = _.get(grades, [course._id, 'all'], Grade.none());

        _.forEach(['#', '%', '~'], (mode) => {
          const formattedGrades = _.chain(courseGrades[mode])
            .map((value, key) => [mode + key, value])  // e.g. '#a', '%d', '~c', ...
            .fromPairs()
            .value();

          _.merge(course, formattedGrades);
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
      $state.go('app.main_grades_course', { id: course._id });
    }
  }
})();
