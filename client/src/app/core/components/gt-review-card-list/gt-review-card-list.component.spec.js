'use strict';

describe('component: gtReviewCardList', function () {
  var $componentController;
  var vm;
  var $mdDialog;
  var $q;
  var $rootScope;
  var $timeout;

  var Course;
  var Semester;
  var Review;
  var msUtils;
  var eventCode;
  var _;

  var review = {
    id: '-K2Q2yAnCsH4KiqDwVy4',
    author: 'c36c1a3f-6655-4f31-b0a4-971fdc87fbe6',
    course: '6505',
    created: '2015-11-05T06:00:00+00:00',
    difficulty: 5,
    rating: 2,
    semester: '2014-3',
    text: 'I dropped it this semester so I can take it by itself.',
    updated: '2015-11-05T06:00:00+00:00',
    workload: 15
  };
  var reviewUpdated = {
    id: '-K2Q2yAnCsH4KiqDwVy4',
    author: 'c36c1a3f-6655-4f31-b0a4-971fdc87fbe6',
    course: '6505',
    created: '2015-11-05T06:00:00+00:00',
    difficulty: 50,
    rating: 20,
    semester: '2014-3',
    text: 'I dropped it this semester so I can take it by itself.',
    updated: '2015-11-05T06:00:00+00:00',
    workload: 150
  };
  var reviews = [{}, {}, review, {}];

  var $event = { foo: 'bar' };
  var onReady = function () {};

  var translations = { CORE: { UPDATED: 'Updated.', REMOVED: 'Removed.' } };

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', translations);
  }));

  beforeEach(inject(function ($injector) {
    $componentController = $injector.get('$componentController');
    $mdDialog = $injector.get('$mdDialog');
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');

    Course = $injector.get('Course');
    Semester = $injector.get('Semester');
    Review = $injector.get('Review');
    msUtils = $injector.get('msUtils');
    eventCode = $injector.get('eventCode');
    _ = $injector.get('_');

    vm = $componentController('gtReviewCardList', null, {
      reviews: reviews,
      showCourseTitle: false,
      readOnly: false,
      onReady: onReady
    });
  }));

  describe('vm.edit', function () {
    var reviewsOriginal;

    beforeEach(function () {
      spyOn($mdDialog, 'show').and.returnValue($q.resolve(reviewUpdated));
      spyOn(Review, 'update').and.returnValue($q.resolve(reviewUpdated));
      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(msUtils, 'toast');

      reviewsOriginal = _.cloneDeep(vm.reviews);
    });

    afterEach(function () {
      vm.reviews = reviewsOriginal;
    });

    it('hooks onReady handler to $postLink', function () {
      expect(vm.$postLink).toEqual(onReady);
    });

    it('shows dialog on edit', function () {
      vm.edit($event, review);
      $timeout.flush();

      expect($mdDialog.show).toHaveBeenCalledWith({
        controller: 'ReviewDialogController as vm',
        templateUrl: 'app/core/dialogs/gt-review/gt-review.html',
        parent: angular.element('body'),
        targetEvent: $event,
        clickOutsideToClose: true,
        locals: {
          review: review
        },
        resolve: {
          courses: Course.all,
          semesters: Semester.all
        }
      });
    });

    it('updates database with edit result', function () {
      vm.edit($event, review);
      $timeout.flush();

      expect(Review.update).toHaveBeenCalledWith(reviewUpdated);
    });

    it('updates state with edit result', function () {
      vm.edit($event, review);
      $timeout.flush();

      expect(reviews[2]).toEqual(reviewUpdated);
    });

    it('broadcasts a review updated event', function () {
      vm.edit($event, review);
      $timeout.flush();

      expect($rootScope.$broadcast).toHaveBeenCalledWith(eventCode.REVIEW_UPDATED, reviewUpdated);
    });

    it('displays a confirmation toast', function () {
      vm.edit($event, review);
      $timeout.flush();

      expect(msUtils.toast).toHaveBeenCalledWith(translations.CORE.UPDATED);
    });

    it('leaves state unchanged for an invalid review', function () {
      var reviewUpdatedOriginal = _.clone(reviewUpdated);

      reviewUpdated.id = 'foo';

      vm.edit($event, review);
      $timeout.flush();

      reviewUpdated = reviewUpdatedOriginal;

      expect(reviews[2]).toEqual(review);
      expect($rootScope.$broadcast).not.toHaveBeenCalledWith(eventCode.REVIEW_UPDATED, reviewUpdated);
      expect(msUtils.toast).not.toHaveBeenCalledWith(translations.CORE.UPDATED);
    });
  });

  describe('vm.remove', function () {
    var reviewsOriginal;

    beforeEach(function () {
      spyOn(msUtils, 'confirm').and.returnValue($q.resolve());
      spyOn(Review, 'remove').and.returnValue($q.resolve());
      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(msUtils, 'toast');

      reviewsOriginal = _.cloneDeep(vm.reviews);

      vm.remove($event, review);
      $timeout.flush();
    });

    afterEach(function () {
      vm.reviews = reviewsOriginal;
    });

    it('prompts user to confirm', function () {
      expect(msUtils.confirm).toHaveBeenCalledWith($event);
    });

    it('removes review from database', function () {
      expect(Review.remove).toHaveBeenCalledWith(review);
    });

    it('removes review from state', function () {
      expect(reviews).toEqual([{}, {}, {}]);
    });

    it('broadcasts a review removed event', function () {
      expect($rootScope.$broadcast).toHaveBeenCalledWith(eventCode.REVIEW_REMOVED, review);
    });

    it('displays a confirmation toast', function () {
      expect(msUtils.toast).toHaveBeenCalledWith(translations.CORE.REMOVED);
    });
  });
});
