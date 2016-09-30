(function () {
  'use strict';

  angular
    .module('app.grades.all')
    .controller('GradesAllController', GradesAllController);

  /** @ngInject */
  function GradesAllController($state, Grade, courses, grades, _) {
    var vm = this;

    // Data

    /**
     * Courses.
     *
     * @type {!Array<Course>}
     */
    vm.courses = courses;

    /**
     * Display mode. One of ['#', '%', '~'].
     *
     * @type {string}
     */
    vm.mode = '%';

    /**
     * Column headers.
     *
     * @type {!Array<object>}
     */
    vm.headers = [{
      key: 'department',
      translate: 'ALL_GRADES.DEPARTMENT',
      classes: 'w-100 text-truncate'
    },{
      key: 'number',
      translate: 'ALL_GRADES.NUMBER',
      classes: 'w-100 text-truncate'
    },{
      key: 'name',
      translate: 'ALL_GRADES.NAME',
      classes: ''
    },{
      key: '"#a"',
      text: '# A',
      classes: 'w-100 text-center',
      mode: '#'
    },{
      key: '"#b"',
      text: '# B',
      classes: 'w-100 text-center',
      mode: '#'
    },{
      key: '"#c"',
      text: '# C',
      classes: 'w-100 text-center',
      mode: '#'
    },{
      key: '"#d"',
      text: '# D',
      classes: 'w-100 text-center',
      mode: '#'
    },{
      key: '"#w"',
      text: '# W',
      classes: 'w-100 text-center',
      mode: '#'
    },{
      key: '"%a"',
      text: '% A',
      classes: 'w-100 text-center',
      mode: '%'
    },{
      key: '"%b"',
      text: '% B',
      classes: 'w-100 text-center',
      mode: '%'
    },{
      key: '"%c"',
      text: '% C',
      classes: 'w-100 text-center',
      mode: '%'
    },{
      key: '"%d"',
      text: '% D',
      classes: 'w-100 text-center',
      mode: '%'
    },{
      key: '"%w"',
      text: '% W',
      classes: 'w-100 text-center',
      mode: '%'
    },{
      key: '"~a"',
      text: '% A',
      classes: 'w-100 text-center',
      mode: '~'
    },{
      key: '"~b"',
      text: '% B',
      classes: 'w-100 text-center',
      mode: '~'
    },{
      key: '"~c"',
      text: '% C',
      classes: 'w-100 text-center',
      mode: '~'
    },{
      key: '"~d"',
      text: '% D',
      classes: 'w-100 text-center',
      mode: '~'
    },{
      key: '"~w"',
      text: '% W',
      classes: 'w-100 text-center',
      mode: '~'
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
      angular.forEach(vm.courses, function (course) {
        var courseGrades = _.get(grades, [course.id, 'all'], null);
        if (courseGrades) {
          _.forEach(['#', '%', '~'], function (mode) {
            _.merge(course, _.chain(courseGrades[mode]).map(function (value, key) {
              return [mode + key, value];
            }).fromPairs().value());
          });
        }
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
      $state.go('app.grades_course', { id: course.id });
    }
  }
})();
