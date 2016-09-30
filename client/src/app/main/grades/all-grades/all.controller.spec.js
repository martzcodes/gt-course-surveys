'use strict';

describe('controller: GradesAllController', function () {
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
    id: '6210',
    department: 'CS',
    foundational: true,
    icon: 'icon-washing-machine',
    name: 'Advanced Operating Systems',
    number: 6210,
    title: '6210 Advanced Operating Systems'
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

  var grades = {
    '6035': {
      '2015-3': {
        '#': { a: 126,   b: 97,    c: 6,   d: 0,   f: 0, i: 0,   s: 0, t: 245, u: 0, v: 0, w: 16   },
        '%': { a:  51.4, b: 39.6,  c: 2.4, d: 0,   f: 0, i: 0,   s: 0, t: 100, u: 0, v: 0, w:  6.5 },
        '~': { a:  55,   b: 42.4,  c: 2.6, d: 0,   f: 0, i: 0,   s: 0, t: 100, u: 0, v: 0, w:  0   }
      },
      '2016-1': {
        '#': { a: 235,   b: 66,    c: 6,   d: 7,   f: 0, i: 1,   s: 0, t: 342, u: 0, v: 0, w: 27   },
        '%': { a:  68.7, b: 19.3,  c: 1.8, d: 2,   f: 0, i: 0.3, s: 0, t: 100, u: 0, v: 0, w:  7.9 },
        '~': { a:  74.6, b: 21,    c: 1.9, d: 2.2, f: 0, i: 0.3, s: 0, t: 100, u: 0, v: 0, w:  0   }
      },
      'all': {
        '#': { a: 361,   b: 163,   c: 12,  d: 7,   f: 0, i: 1,   s: 0, t: 587, u: 0, v: 0, w: 43   },
        '%': { a:  61.5, b:  27.8, c:  2,  d: 1.2, f: 0, i: 0.2, s: 0, t: 100, u: 0, v: 0, w:  7.3 },
        '~': { a:  66.4, b:  30,   c: 2.2, d: 1.3, f: 0, i: 0.2, s: 0, t: 100, u: 0, v: 0, w:  0   }
      }
    },
    '6210': {
      '2014-1': {
        '#': { a: 36,    b:  7,    c: 0,   d: 2,   f: 0, i: 0,   s: 0, t: 105, u: 0, v: 0, w: 60   },
        '%': { a: 34.3,  b:  6.7,  c: 0,   d: 1.9, f: 0, i: 0,   s: 0, t: 100, u: 0, v: 0, w: 57.1 },
        '~': { a: 80,    b: 15.6,  c: 0,   d: 4.4, f: 0, i: 0,   s: 0, t: 100, u: 0, v: 0, w:  0   }
      },
      'all': {
        '#': { a: 36,    b:  7,    c: 0,   d: 2,   f: 0, i: 0,   s: 0, t: 105, u: 0, v: 0, w: 60   },
        '%': { a: 34.3,  b:  6.7,  c: 0,   d: 1.9, f: 0, i: 0,   s: 0, t: 100, u: 0, v: 0, w: 57.1 },
        '~': { a: 80,    b: 15.6,  c: 0,   d: 4.4, f: 0, i: 0,   s: 0, t: 100, u: 0, v: 0, w:  0   }
      }
    }
  };

  var _;
  var $state;
  var Grade;

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector, $controller) {
    _ = $injector.get('_');
    $state = $injector.get('$state');
    Grade = $injector.get('Grade');

    vm = $controller('GradesAllController', {
      courses: courses,
      grades: grades
    });
  }));

  it('starts with percentages', function () {
    expect(vm.mode).toEqual('%');
  });

  it('starts without any sorting', function () {
    expect(vm.sortKey).toBeNull();
    expect(vm.sortReverse).toBeNull();
  });

  describe('init', function () {
    it('adds grade data to course entities', function () {
      _.forEach(vm.courses, function (course) {
        var courseGrades = _.get(grades, [course.id, 'all'], {});
        _.forEach(['#', '%', '~'], function (mode) {
          _.forEach(_.keys(Grade.none()), function (key) {
            expect(course[mode + key]).toEqual(_.get(courseGrades, [mode, key]));
          });
        });
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
      expect($state.go).toHaveBeenCalledWith('app.grades_course', { id: courses[0].id });
    });
  });
});
