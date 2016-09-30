'use strict';

describe('controller: QuickPanelController', function () {
  var $rootScope;
  var $scope;
  var $timeout;
  var $state;
  var $q;

  var Review;
  var eventCode;

  var vm;
  var review = { foo: 'bar' };
  var reviews = [{}, {}, {}];
  var reviewsRecent = [{}, {}, {}, {}, {}];

  var $mdSidenavToggle;
  var $mdSidenav;

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector, $controller) {
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $timeout = $injector.get('$timeout');
    $state = $injector.get('$state');
    $q = $injector.get('$q');

    Review = $injector.get('Review');
    eventCode = $injector.get('eventCode');

    $mdSidenavToggle = jasmine.createSpy().and.returnValue($q.resolve());
    $mdSidenav = jasmine.createSpy().and.returnValue({ toggle: $mdSidenavToggle });

    vm = $controller('QuickPanelController', {
      $scope: $scope,
      $mdSidenav: $mdSidenav,
      reviews: reviews
    });

    spyOn($state, 'go');
  }));

  it('caches reviews', function () {
    expect(vm.reviews).toBe(reviews);
  });

  describe('event listeners', function () {
    beforeEach(function () {
      spyOn(Review, 'isRecent').and.returnValue(false);
    });

    it('reacts to review create', function () {
      $rootScope.$broadcast(eventCode.REVIEW_CREATED, review);
      expect(Review.isRecent).toHaveBeenCalledWith(review);
    });

    it('reacts to review update', function () {
      $rootScope.$broadcast(eventCode.REVIEW_UPDATED, review);
      expect(Review.isRecent).toHaveBeenCalledWith(review);
    });

    it('reacts to review remove', function () {
      $rootScope.$broadcast(eventCode.REVIEW_REMOVED, review);
      expect(Review.isRecent).toHaveBeenCalledWith(review);
    });

    it('stops listening to review changes after destroy', function () {
      $scope.$emit('$destroy');

      $rootScope.$broadcast(eventCode.REVIEW_CREATED, review);
      $rootScope.$broadcast(eventCode.REVIEW_UPDATED, review);
      $rootScope.$broadcast(eventCode.REVIEW_REMOVED, review);

      expect(Review.isRecent).not.toHaveBeenCalled();
    });
  });

  describe('handleReviewChange', function () {
    beforeEach(function () {
      spyOn(Review, 'getRecent').and.returnValue($q.resolve(reviewsRecent));
    });

    afterEach(function () {
      vm.reviews = reviews;
    });

    it('updates state if changed review is a reviewsRecent one', function () {
      spyOn(Review, 'isRecent').and.returnValue(true);
      $rootScope.$broadcast(eventCode.REVIEW_CREATED, review);
      $timeout.flush();

      expect(Review.isRecent).toHaveBeenCalledWith(review);
      expect(Review.getRecent).toHaveBeenCalled();
      expect(vm.reviews).toEqual(reviewsRecent);
    });

    it('leaves state unchanged if changed review is not a reviewsRecent one', function () {
      spyOn(Review, 'isRecent').and.returnValue(false);
      $rootScope.$broadcast(eventCode.REVIEW_CREATED, review);
      $timeout.flush();

      expect(Review.isRecent).toHaveBeenCalledWith(review);
      expect(Review.getRecent).not.toHaveBeenCalled();
      expect(vm.reviews).toEqual(reviews);
    });
  });

  describe('vm.goTo', function () {
    var review;

    beforeEach(function () {
      review = { course: '6505', id: 'foo' };

      $mdSidenav.calls.reset();
      $mdSidenavToggle.calls.reset();
      $state.go.calls.reset();
    });

    it('navigates to a review', function () {
      vm.goTo(review);

      expect($mdSidenav).toHaveBeenCalledWith('quick-panel');
      expect($mdSidenavToggle).toHaveBeenCalled();
      expect($state.go).not.toHaveBeenCalled();

      $timeout.flush();

      expect($state.go).toHaveBeenCalledWith('app.reviews_course', { id: review.course, rid: review.id });
    });
  });
});
