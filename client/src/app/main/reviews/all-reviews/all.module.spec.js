'use strict';

describe('module: app.reviews.all', function () {
  var $rootScope;
  var $state;
  var $q;

  var Course;
  var Aggregation;

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector, $templateCache) {
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    $q = $injector.get('$q');

    Course = $injector.get('Course');
    Aggregation = $injector.get('Aggregation');

    $templateCache.put('app/core/layouts/vertical-navigation.html', '');
    $templateCache.put('app/toolbar/layouts/vertical-navigation/toolbar.html', '');
    $templateCache.put('app/navigation/layouts/vertical-navigation/navigation.html', '');
    $templateCache.put('app/quick-panel/quick-panel.html', '');
    $templateCache.put('app/main/reviews/all-reviews/all.html', '');

    spyOn(Course, 'all').and.returnValue($q.resolve([]));
    spyOn(Aggregation, 'all').and.returnValue($q.resolve([]));

    $state.go('app.reviews_all');
    $rootScope.$digest();
  }));

  it('loads all courses', function () {
    expect(Course.all).toHaveBeenCalled();
  });

  it('loads all aggregations', function () {
    expect(Aggregation.all).toHaveBeenCalled();
  });
});
