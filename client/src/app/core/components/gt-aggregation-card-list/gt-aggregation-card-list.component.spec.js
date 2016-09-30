'use strict';

describe('component: gtAggregationCardList', function () {
  var $componentController;
  var $rootScope;
  var $scope;
  var $q;
  var $timeout;

  var eventCode;
  var Aggregation;

  var review = { course: '6505' };
  var aggregation = {
    count: 2,
    average: {
      difficulty: 10.1,
      workload: 29.3,
      rating: 3.1
    }
  };

  var vm;

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector) {
    $componentController = $injector.get('$componentController');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $q = $injector.get('$q');
    $timeout = $injector.get('$timeout');

    eventCode = $injector.get('eventCode');
    Aggregation = $injector.get('Aggregation');

    spyOn(Aggregation, 'get').and.returnValue($q.resolve(aggregation));

    var locals = { $scope: $scope };
    var bindings = { aggregation: null };
    vm = $componentController('gtAggregationCardList', locals, bindings);

    vm.$onInit();
  }));

  afterEach(function () {
    Aggregation.get.calls.reset();
  });

  it('defaults aggregation if omitted', function () {
    expect(vm.aggregation).toEqual(Aggregation.none());
  });

  it('reacts to review create', function () {
    $rootScope.$broadcast(eventCode.REVIEW_CREATED, review);
    $timeout.flush();

    expect(vm.aggregation).toEqual(aggregation);
    expect(Aggregation.get).toHaveBeenCalledWith(review.course);
  });

  it('reacts to review update', function () {
    $rootScope.$broadcast(eventCode.REVIEW_UPDATED, review);
    $timeout.flush();

    expect(vm.aggregation).toEqual(aggregation);
    expect(Aggregation.get).toHaveBeenCalledWith(review.course);
  });

  it('reacts to review remove', function () {
    $rootScope.$broadcast(eventCode.REVIEW_REMOVED, review);
    $timeout.flush();

    expect(vm.aggregation).toEqual(aggregation);
    expect(Aggregation.get).toHaveBeenCalledWith(review.course);
  });

  it('stops listening to review changes after destroy', function () {
    vm.$onDestroy();

    vm.aggregation = null;
    $rootScope.$broadcast(eventCode.REVIEW_CREATED, review);
    $rootScope.$broadcast(eventCode.REVIEW_UPDATED, review);
    $rootScope.$broadcast(eventCode.REVIEW_REMOVED, review);

    expect(vm.aggregation).toBeNull();
    expect(Aggregation.get.calls.count()).toEqual(0);
  });
});
