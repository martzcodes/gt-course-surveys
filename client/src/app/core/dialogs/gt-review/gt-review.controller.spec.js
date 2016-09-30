'use strict';

describe('controller: ReviewDialogController', function () {
  var $controller;
  var $mdDialog;

  var vm;

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
  var courses = [{}, {}];
  var semesters = [{}, {}, {}];

  beforeEach(module('app'));

  beforeEach(inject(function ($injector) {
    $controller = $injector.get('$controller');
    $mdDialog = $injector.get('$mdDialog');

    vm = $controller('ReviewDialogController', {
      review: review,
      courses: courses,
      semesters: semesters
    });
  }));

  it('initializes state', function () {
    expect(vm.review).toEqual(review);
    expect(vm.review === review).toBe(false);

    expect(vm.courses).toEqual(courses);
    expect(vm.semesters).toEqual(semesters);
    expect(vm.difficulties).toEqual([1,2,3,4,5]);
    expect(vm.ratings).toEqual([1,2,3,4,5]);
  });

  it('recognizes an add', function () {
    vm = $controller('ReviewDialogController', {
      review: { course: '6505' },
      courses: [],
      semesters: []
    });

    expect(vm.editing).toBe(false);
  });

  it('recognizes an edit', function () {
    expect(vm.editing).toBe(true);
  });

  describe('vm.hide', function () {
    beforeEach(function() {
      spyOn($mdDialog, 'hide');
    });

    it('hides the dialog', function () {
      vm.hide();

      expect($mdDialog.hide).toHaveBeenCalledWith(review);
    });

    it('formats review text before hiding', function () {
      vm.review.text = '  Test .  One  ,two , and three  .  ';
      vm.hide();

      expect($mdDialog.hide.calls.mostRecent().args[0].text).toEqual('Test. One, two, and three.');
    });
  });

  describe('vm.cancel', function () {
    beforeEach(function() {
      spyOn($mdDialog, 'cancel');
    });

    it('cancels the dialog', function () {
      vm.cancel();

      expect($mdDialog.cancel).toHaveBeenCalled();
    });
  });
});
