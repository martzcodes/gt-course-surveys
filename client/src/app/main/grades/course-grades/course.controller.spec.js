'use strict';

describe('controller: GradesCourseController', function () {
  var $rootScope;
  var $scope;
  var $mdMedia;

  var Grade;
  var Semester;

  var _;

  var vm;

  var course = {
    id: '6035',
    department: 'CS',
    foundational: false,
    icon: 'icon-security',
    name: 'Intro to Information Security',
    number: 6035,
    title: '6035 Intro to Information Security'
  };

  var grades = {
    '2015-3': {
      '#': { a: 126, b: 97, c: 6, d: 0, f: 0, i: 0, s: 0, t: 245, u: 0, v: 0, w: 16 },
      '%': { a: 51.4, b: 39.6, c: 2.4, d: 0, f: 0, i: 0, s: 0, t: 100, u: 0, v: 0, w: 6.5 },
      '~': { a: 55, b: 42.4, c: 2.6, d: 0, f: 0, i: 0, s: 0, t: 100, u: 0, v: 0, w: 0 }
    },
    '2016-1': {
      '#': { a: 235, b: 66, c: 6, d: 7, f: 0, i: 1, s: 0, t: 342, u: 0, v: 0, w: 27 },
      '%': { a: 68.7, b: 19.3, c: 1.8, d: 2, f: 0, i: 0.3, s: 0, t: 100, u: 0, v: 0, w: 7.9 },
      '~': { a: 74.6, b: 21, c: 1.9, d: 2.2, f: 0, i: 0.3, s: 0, t: 100, u: 0, v: 0, w: 0 }
    }
  };

  var semesters = [{
    id: '2014-1',
    season: 1,
    year: 2014,
    name: 'Spring 2014'
  },{
    id: '2014-2',
    season: 2,
    year: 2014,
    name: 'Summer 2014'
  },{
    id: '2014-3',
    season: 3,
    year: 2014,
    name: 'Fall 2014'
  },{
    id: '2015-1',
    season: 1,
    year: 2015,
    name: 'Spring 2015'
  },{
    id: '2015-2',
    season: 2,
    year: 2015,
    name: 'Summer 2015'
  },{
    id: '2015-3',
    season: 3,
    year: 2015,
    name: 'Fall 2015'
  },{
    id: '2016-1',
    season: 1,
    year: 2016,
    name: 'Spring 2016'
  },{
    id: '2016-2',
    season: 2,
    year: 2016,
    name: 'Summer 2016'
  },{
    id: '2016-3',
    season: 3,
    year: 2016,
    name: 'Fall 2016'
  }];

  var translations = { COURSE_REVIEWS: { PUBLISHED: 'Published.' } };

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', translations);
  }));

  beforeEach(inject(function ($injector, $controller) {
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $mdMedia = jasmine.createSpy('$mdMedia').and.returnValue(true);

    Grade = $injector.get('Grade');
    Semester = $injector.get('Semester');

    _ = $injector.get('_');

    vm = $controller('GradesCourseController', {
      $scope: $scope,
      $mdMedia: $mdMedia,
      course: course,
      grades: grades,
      semesters: semesters
    });
  }));

  afterEach(function () {
    vm.course = course;
    vm.grades = grades;
    vm.semesters = semesters;
  });

  it('excludes `all` from grades', function () {
    expect(vm.grades['all']).toBeUndefined();
  });

  it('excludes unknown from list of semesters', function () {
    expect(_.find(vm.semesters, Semester.isUnknown)).toBeUndefined();
  });

  it('inits with percentages', function () {
    expect(vm.mode).toEqual('%');
  });

  it('inits chart options', function () {
    expect(vm.options).toBeDefined();
  });

  it('inits chart data', function () {
    expect(vm.data).toBeDefined();
  });

  describe('vm.options', function () {
    it('checks screen size', function () {
      vm.refresh();
      expect($mdMedia).toHaveBeenCalledWith('gt-md');
    });

    it('adjusts y-axis range to [0,100] for percentages', function () {
      vm.mode = '%';
      vm.refresh();
      expect(vm.options.chart.forceY).toEqual([0, 100]);
    });

    it('formats percentages by rounding and appending a % symbol', function () {
      vm.mode = '%';
      vm.refresh();
      expect(vm.options.chart.yAxis.tickFormat(52.4)).toEqual('52%');
    });

    it('adjusts y-axis range to nearest larger multiple of 100 for counts', function () {
      vm.mode = '#';
      vm.refresh();
      expect(vm.options.chart.forceY).toEqual([0, 400]);
    });

    it('formats counts as integers', function () {
      vm.mode = '#';
      vm.refresh();
      expect(vm.options.chart.yAxis.tickFormat(52)).toEqual('52');
    });

    it('adjusts to small screens', function () {
      $mdMedia.and.returnValue(false);
      vm.refresh();
      expect(vm.options.chart.margin.bottom).toEqual(24);
      expect(vm.options.chart.showControls).toBe(false);
      expect(vm.options.chart.showLegend).toBe(false);
      expect(vm.options.chart.showXAxis).toBe(false);
    });

    it('adjusts to large screens', function () {
      $mdMedia.and.returnValue(true);
      vm.refresh();
      expect(vm.options.chart.margin.bottom).toEqual(36);
      expect(vm.options.chart.showControls).toBe(true);
      expect(vm.options.chart.showLegend).toBe(true);
      expect(vm.options.chart.showXAxis).toBe(true);
    });

    afterEach(function () {
      $mdMedia.calls.reset();
      $mdMedia.and.returnValue(true);
    });
  });

  describe('vm.data', function () {
    it('groups data by grade type (e.g. A, B, C, ...)', function () {
      var observedKeys = _.map(vm.data, 'key');
      var expectedKeys = _.chain(Grade.none()).get(vm.mode).omit('t').keys().map(_.toUpper).value().sort();
      expect(observedKeys).toEqual(expectedKeys);
    });

    it('groups grade type data by semester', function () {
      var expectedGroupings = _.map(semesters, 'name');
      _.forEach(vm.data, function (series) {
        var observedGroupings = _.map(series.values, 'x');
        expect(observedGroupings).toEqual(expectedGroupings);
      });
    });
  });
});
