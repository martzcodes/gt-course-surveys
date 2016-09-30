'use strict';

describe('module: app.grades.course', function () {
  var $rootScope;
  var $state;
  var $q;

  var Course;
  var Grade;
  var Semester;

  var course = {
    id: '6035',
    department: 'CS',
    foundational: false,
    icon: 'icon-security',
    name: 'Intro to Information Security',
    number: 6035,
    title: '6035 Intro to Information Security'
  };

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector, $templateCache) {
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    $q = $injector.get('$q');

    Course = $injector.get('Course');
    Grade = $injector.get('Grade');
    Semester = $injector.get('Semester');

    $templateCache.put('app/core/layouts/vertical-navigation.html', '');
    $templateCache.put('app/toolbar/layouts/vertical-navigation/toolbar.html', '');
    $templateCache.put('app/navigation/layouts/vertical-navigation/navigation.html', '');
    $templateCache.put('app/quick-panel/quick-panel.html', '');
    $templateCache.put('app/main/grades/course-grades/course.html', '');

    spyOn(Course, 'get').and.returnValue($q.resolve(null));
    spyOn(Grade, 'get').and.returnValue($q.resolve(null));
    spyOn(Semester, 'all').and.returnValue($q.resolve(null));

    $state.go('app.grades_course', { id: course.id });
    $rootScope.$digest();
  }));

  it('loads the course', function () {
    expect(Course.get).toHaveBeenCalledWith(course.id);
  });

  it('loads the course grades', function () {
    expect(Grade.get).toHaveBeenCalledWith(course.id);
  });

  it('loads all semesters', function () {
    expect(Semester.all).toHaveBeenCalled();
  });
});
