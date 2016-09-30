'use strict';

describe('module: app.reviews.course', function () {
  var $rootScope;
  var $state;
  var $q;

  var Course;
  var Review;
  var Aggregation;

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
    Review = $injector.get('Review');
    Aggregation = $injector.get('Aggregation');

    $templateCache.put('app/core/layouts/vertical-navigation.html', '');
    $templateCache.put('app/toolbar/layouts/vertical-navigation/toolbar.html', '');
    $templateCache.put('app/navigation/layouts/vertical-navigation/navigation.html', '');
    $templateCache.put('app/quick-panel/quick-panel.html', '');
    $templateCache.put('app/main/reviews/course-reviews/course.html', '');

    spyOn(Course, 'get').and.returnValue($q.resolve(null));
    spyOn(Review, 'getByCourse').and.returnValue($q.resolve([]));
    spyOn(Aggregation, 'get').and.returnValue($q.resolve(null));

    $state.go('app.reviews_course', { id: course.id });
    $rootScope.$digest();
  }));

  it('loads the course', function () {
    expect(Course.get).toHaveBeenCalledWith(course.id);
  });

  it('loads the course reviews', function () {
    expect(Review.getByCourse).toHaveBeenCalledWith(course.id);
  });

  it('loads the course reviews aggregation', function () {
    expect(Aggregation.get).toHaveBeenCalledWith(course.id);
  });
});
