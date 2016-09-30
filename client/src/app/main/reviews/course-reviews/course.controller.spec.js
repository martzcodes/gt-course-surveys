'use strict';

describe('controller: ReviewsCourseController', function () {
  var $rootScope;
  var $scope;
  var $q;
  var $timeout;
  var $mdDialog;

  var Course;
  var Semester;
  var Review;
  var msUtils;
  var eventCode;
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

  var reviews = [{
    id: '-K2Q2yDLqpmXk7WmewXE',
    author: 'c36c1a3f-6655-4f31-b0a4-971fdc87fbe6',
    course: '6505',
    created: '2015-11-05T06:00:00+00:00',
    difficulty: 3,
    semester: '2015-3',
    text: 'If you are familiar ...',
    updated: '2015-11-05T06:00:00+00:00',
    workload: 10,
    authorName: 'Anonymous',
    authorImageUrl: 'assets/images/avatars/anonymous.png',
    courseTitle: '6505 Computability, Complexity & Algorithms',
    semesterName: 'Fall 2015'
  }];

  var aggregation = {
    id: '6035',
    average: {
      difficulty: 2.5,
      rating: 3.9,
      workload: 7.3
    },
    count: 91,
    hash: 1537990979
  };

  var translations = { COURSE_REVIEWS: { PUBLISHED: 'Published.' } };

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', translations);
  }));

  beforeEach(inject(function ($injector, $controller) {
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $q = $injector.get('$q');
    $timeout = $injector.get('$timeout');
    $mdDialog = $injector.get('$mdDialog');

    Course = $injector.get('Course');
    Review = $injector.get('Review');
    Semester = $injector.get('Semester');
    msUtils = $injector.get('msUtils');
    eventCode = $injector.get('eventCode');
    _ = $injector.get('_');

    vm = $controller('ReviewsCourseController', {
      $scope: $scope,
      course: course,
      reviews: reviews,
      aggregation: aggregation
    });

    $scope.$digest();
    $timeout.flush();
  }));

  afterEach(function () {
    vm.course = course;
    vm.reviews = reviews;
    vm.aggregation = aggregation;
  });

  describe('checkForUpdatesByOthers', function () {
    var reviewsNew;

    beforeEach(function () {
      reviewsNew = [{}];
      spyOn(Review, 'getByCourse').and.returnValue($q.resolve(reviewsNew));
    });

    it('does nothing if already working', function () {
      vm.working = true;
      $scope.$apply('vm.aggregation.changed = true');
      $scope.$digest();

      expect(Review.getByCourse).not.toHaveBeenCalled();
      expect(vm.reviews).toEqual(reviews);
    });

    it('updates reviews if server and client hashes differ', function () {
      $scope.$apply('vm.aggregation.changed = true');
      $scope.$digest();

      expect(Review.getByCourse).toHaveBeenCalledWith(course.id, true);
      expect(vm.reviews).toEqual(reviewsNew);
    });
  });

  describe('vm.publish', function () {
    var $event;
    var review;

    beforeEach(function () {
      $event = { foo: 'bar' };
      review = _.clone(reviews[0]);

      vm.reviews = [];
      spyOn($mdDialog, 'show').and.returnValue($q.resolve(review));
      spyOn(Review, 'push').and.returnValue($q.resolve(review));
      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(msUtils, 'toast');

      vm.publish($event);
      $timeout.flush();
    });

    it('brings up a dialog for publishing', function () {
      expect($mdDialog.show).toHaveBeenCalledWith({
        controller: 'ReviewDialogController as vm',
        templateUrl: 'app/core/dialogs/gt-review/gt-review.html',
        parent: angular.element('body'),
        targetEvent: $event,
        clickOutsideToClose: true,
        locals: {
          review: {
            course: vm.course.id
          }
        },
        resolve: {
          courses: Course.all,
          semesters: Semester.all
        }
      });
    });

    it('commits push to database', function () {
      expect(Review.push).toHaveBeenCalledWith(review);
    });

    it('updates state', function () {
      expect(_.last(vm.reviews)).toEqual(review);
    });

    it('broadcasts a review created event', function () {
      expect($rootScope.$broadcast).toHaveBeenCalledWith(eventCode.REVIEW_CREATED, review);
    });

    it('displays a confirmation toast', function () {
      expect(msUtils.toast).toHaveBeenCalledWith(translations.COURSE_REVIEWS.PUBLISHED);
    });
  });
});
