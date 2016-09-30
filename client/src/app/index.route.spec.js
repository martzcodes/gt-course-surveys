'use strict';

describe('config: Index', function () {
  var $rootScope;
  var $state;
  var $q;

  var Auth;
  var Review;
  var Course;
  var Aggregation;

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector, $templateCache) {
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    $q = $injector.get('$q');

    Auth = $injector.get('Auth');
    Review = $injector.get('Review');
    Course = $injector.get('Course');
    Aggregation = $injector.get('Aggregation');

    $templateCache.put('app/core/layouts/vertical-navigation.html', '');
    $templateCache.put('app/toolbar/layouts/vertical-navigation/toolbar.html', '');
    $templateCache.put('app/navigation/layouts/vertical-navigation/navigation.html', '');
    $templateCache.put('app/quick-panel/quick-panel.html', '');
    $templateCache.put('app/main/about/faq/faq.html', '');

    spyOn(Auth, 'waitForCurrentUserData').and.returnValue($q.resolve(null));
    spyOn(Review, 'getRecent').and.returnValue($q.resolve([]));
    spyOn(Course, 'all').and.returnValue($q.resolve([]));
    spyOn(Aggregation, 'all').and.returnValue($q.resolve([]));

    $state.go('app.about_faq');
    $rootScope.$digest();
  }));

  it('requests current user data for toolbar', function () {
    expect(Auth.waitForCurrentUserData).toHaveBeenCalled();
  });

  it('requests recent reviews for quick panel', function () {
    expect(Review.getRecent).toHaveBeenCalled();
  });
});
