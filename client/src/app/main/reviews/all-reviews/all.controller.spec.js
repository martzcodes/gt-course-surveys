'use strict';

describe('controller: ReviewsAllController', function () {
  var vm;

  var courses = [{
    id: '6035',
    department: 'CS',
    foundational: false,
    icon: 'icon-security',
    name: 'Intro to Information Security',
    number: 6035,
    title: '6035 Intro to Information Security'
  },{
    id: '6505',
    department: 'CS',
    foundational: true,
    icon: 'keyboard-off',
    name: 'Computability, Complexity & Algorithms',
    number: 6505,
    title: '6505 Computability, Complexity & Algorithms'
  },{
    id: '8803-BDHI',
    department: 'CSE',
    foundational: false,
    icon: 'icon-data',
    name: 'Big Data for Health Informatics',
    number: 8803,
    section: 1,
    title: '8803-1 Big Data for Health Informatics'
  }];

  var aggregations = [{
    id: '6035',
    average: {
      difficulty: 2.5,
      rating: 3.9,
      workload: 7.3
    },
    count: 91,
    hash: 1537990979
  },{
    id: '8803-BDHI',
    average: {
      difficulty: 4.8,
      rating: 2.2,
      workload: 21.3
    },
    count: 72,
    hash: -1855987841
  }];

  var _;
  var $state;

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector, $controller) {
    _ = $injector.get('_');
    $state = $injector.get('$state');

    vm = $controller('ReviewsAllController', {
      courses: courses,
      aggregations: aggregations
    });
  }));

  it('starts without any sorting', function () {
    expect(vm.sortKey).toBeNull();
    expect(vm.sortReverse).toBeNull();
  });

  describe('init', function () {
    it('sets stats to 0 for courses without aggregations', function () {
      var course = _.find(vm.courses, ['id', '6505']);

      expect(course.reviews).toEqual(0);
      expect(course.difficulty).toEqual(0);
      expect(course.workload).toEqual(0);
      expect(course.rating).toEqual(0);
    });

    it('sets stats for courses with aggregations', function () {
      _.forEach(aggregations, function (aggregation) {
        var course = _.find(vm.courses, ['id', aggregation.id]);

        expect(course.reviews).toEqual(aggregation.count);
        expect(course.difficulty).toEqual(aggregation.average.difficulty);
        expect(course.workload).toEqual(aggregation.average.workload);
        expect(course.rating).toEqual(aggregation.average.rating);
      });
    });
  });

  describe('vm.sortOn', function () {
    var column;

    beforeEach(function () {
      vm.sortKey = null;
      vm.sortReverse = null;
    });

    afterEach(function () {
      vm.sortKey = null;
      vm.sortReverse = null;
    });

    it('updates the sort key', function () {
      column = vm.headers[0];
      vm.sortOn(column);
      expect(vm.sortKey).toEqual(column.key);
    });

    it('toggles sort reverse if sorting on same column', function () {
      column = vm.headers[0];
      vm.sortOn(column);
      expect(vm.sortReverse).toBe(true);
      vm.sortOn(column);
      expect(vm.sortReverse).toBe(false);
      vm.sortOn(column);
      expect(vm.sortReverse).toBe(true);
      vm.sortOn(column);
      expect(vm.sortReverse).toBe(false);
    });

    it('keeps sort reverse same when switching sort column while reverse sorting', function () {
      column = vm.headers[1];
      vm.sortOn(column); // sortReverse === true
      column = vm.headers[2];
      vm.sortOn(column);
      expect(vm.sortReverse).toBe(true);
    });

    it('keeps sort reverse same when switching sort column while forward sorting', function () {
      column = vm.headers[1];
      vm.sortOn(column); // sortReverse === true
      vm.sortOn(column); // sortReverse === false
      column = vm.headers[2];
      vm.sortOn(column);
      expect(vm.sortReverse).toBe(false);
    });
  });

  describe('vm.sortingOn', function () {
    var column;

    beforeEach(function () {
      vm.sortKey = 'name';
    });

    afterEach(function () {
      vm.sortKey = null;
    });

    it('returns falsy if input is falsy', function () {
      _.forEach([undefined, null, false, 0], function (test) {
        expect(vm.sortingOn(test)).toBeFalsy();
      });
    });

    it('returns falsy if not sorting on the given column', function () {
      column = _.find(vm.headers, ['key', 'number']);
      expect(vm.sortingOn(column)).toBeFalsy();
    });

    it('returns true if sorting on the given column', function () {
      column = _.find(vm.headers, ['key', vm.sortKey]);
      expect(vm.sortingOn(column)).toBe(true);
    });
  });

  describe('vm.goTo', function () {
    beforeEach(function () {
      spyOn($state, 'go');
    });

    it('navigates to the course reviews view', function () {
      vm.goTo(courses[0]);
      expect($state.go).toHaveBeenCalledWith('app.reviews_course', { id: courses[0].id });
    });
  });
});
