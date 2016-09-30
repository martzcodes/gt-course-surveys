'use strict';

describe('controller: GradesCourseController', function () {
  var $rootScope;
  var $scope;
  var $q;

  var Course;
  var Grade;
  var Semester;

  var _;
  var d3;

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

  var grades = {};

  var semesters = [];

  var translations = { COURSE_REVIEWS: { PUBLISHED: 'Published.' } };

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', translations);
  }));

  beforeEach(inject(function ($injector, $controller) {
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $q = $injector.get('$q');

    Course = $injector.get('Course');
    Grade = $injector.get('Grade');
    Semester = $injector.get('Semester');

    _ = $injector.get('_');
    d3 = $injector.get('d3');

    vm = $controller('GradesCourseController', {
      $scope: $scope,
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

  });

  it('inits chart data', function () {

  });

  describe('vm.options', function () {
    it('adjusts y-axis range to [0,100] for percentages', function () {

    });

    it('adjusts y-axis range to nearest larger multiple of 100 for counts', function () {

    });

    it('translates control labels', function () {

    });

    it('adjusts to small screens', function () {

    });

    it('adjusts to large screens', function () {

    });
  });

  describe('vm.data', function () {
    it('groups data by grade type (e.g. A, B, C, ...)', function () {

    });

    it('groups grade type data by semester', function () {

    });
  });
});
