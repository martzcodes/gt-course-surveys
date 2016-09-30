'use strict';

describe('module: app.grades.all', function () {
  var $rootScope;
  var $state;
  var $q;

  var Course;
  var Grade;

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector, $templateCache) {
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    $q = $injector.get('$q');

    Course = $injector.get('Course');
    Grade = $injector.get('Grade');

    $templateCache.put('app/core/layouts/vertical-navigation.html', '');
    $templateCache.put('app/toolbar/layouts/vertical-navigation/toolbar.html', '');
    $templateCache.put('app/navigation/layouts/vertical-navigation/navigation.html', '');
    $templateCache.put('app/quick-panel/quick-panel.html', '');
    $templateCache.put('app/main/grades/all-grades/all.html', '');

    spyOn(Course, 'all').and.returnValue($q.resolve([]));
    spyOn(Grade, 'all').and.returnValue($q.resolve([]));

    $state.go('app.grades_all');
    $rootScope.$digest();
  }));

  it('loads all courses', function () {
    expect(Course.all).toHaveBeenCalled();
  });

  it('loads all grades', function () {
    expect(Grade.all).toHaveBeenCalled();
  });
});
