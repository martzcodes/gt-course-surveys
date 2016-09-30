'use strict';

describe('directive: gtCountUpTo', function () {
  var $rootScope;
  var $timeout;
  var $compile;

  var countUpStartSpy = jasmine.createSpy('CountUp.start');
  var countUpSpy = jasmine.createSpy('CountUp').and.returnValue({ start: countUpStartSpy });

  beforeEach(module('app', function ($translateProvider, $provide) {
    $translateProvider.translations('en', {});

    $provide.constant('CountUp', countUpSpy);
  }));

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');
    $compile = $injector.get('$compile');
  }));

  describe('from', function () {
    it('defaults to 0', function () {
      $compile('<div gt-count-up-to="2"></div>')($rootScope);
      $rootScope.$digest();
      $timeout.flush();

      expect(countUpSpy.calls.mostRecent().args[1]).toEqual(0);
    });

    it('can be overriden with an integer', function () {
      $compile('<div gt-count-up-to="2" from="1.2"></div>')($rootScope);
      $rootScope.$digest();
      $timeout.flush();

      expect(countUpSpy.calls.mostRecent().args[1]).toEqual(1);
    });
  });

  describe('decimals', function () {
    it('defaults to 2', function () {
      $compile('<div gt-count-up-to="5"></div>')($rootScope);
      $rootScope.$digest();
      $timeout.flush();

      expect(countUpSpy.calls.mostRecent().args[3]).toEqual(2);
    });

    it('can be customized with an integer', function () {
      $compile('<div gt-count-up-to="5" decimals="3.4"></div>')($rootScope);
      $rootScope.$digest();
      $timeout.flush();

      expect(countUpSpy.calls.mostRecent().args[3]).toEqual(3);
    });
  });

  describe('duration', function () {
    it('defaults to 3', function () {
      $compile('<div gt-count-up-to="102"></div>')($rootScope);
      $rootScope.$digest();
      $timeout.flush();

      expect(countUpSpy.calls.mostRecent().args[4]).toEqual(3);
    });

    it('can be customized with a float', function () {
      $compile('<div gt-count-up-to="77" duration="12.73"></div>')($rootScope);
      $rootScope.$digest();
      $timeout.flush();

      expect(countUpSpy.calls.mostRecent().args[4]).toEqual(12.73);
    });
  });

  it('starts animation after timeout', function () {
    countUpSpy.calls.reset();
    countUpStartSpy.calls.reset();

    $compile('<div gt-count-up-to="53"></div>')($rootScope);
    $rootScope.$digest();

    expect(countUpSpy.calls.count()).toEqual(0);
    expect(countUpStartSpy.calls.count()).toEqual(0);

    $timeout.flush();

    expect(countUpSpy.calls.count()).toEqual(1);
    expect(countUpSpy.calls.mostRecent().args[2]).toEqual(53);
    expect(countUpStartSpy.calls.count()).toEqual(1);
  });

  it('reanimates after model change', function () {
    var $scope = $rootScope.$new();
    $scope.value = 123;
    $compile('<div gt-count-up-to="value"></div>')($scope);
    $scope.$digest();
    $timeout.flush();

    countUpSpy.calls.reset();
    countUpStartSpy.calls.reset();

    $scope.value *= 2;
    $scope.$digest();
    $timeout.flush();

    expect(countUpSpy.calls.count()).toEqual(1);
    expect(countUpSpy.calls.mostRecent().args[2]).toEqual($scope.value);
    expect(countUpStartSpy.calls.count()).toEqual(1);
  });

  it('stops listening for model changes after destroy', function () {
    var $scope = $rootScope.$new();
    $scope.value = 456;
    $compile('<div gt-count-up-to="value"></div>')($scope);
    $scope.$digest();
    $timeout.flush();

    countUpSpy.calls.reset();
    countUpStartSpy.calls.reset();

    $scope.$destroy();

    $scope.value -= 20;

    /* eslint-disable */
    try {
      $scope.$digest();
      $timeout.flush();
    } catch (ex) {}
    /* eslint-enable */

    expect(countUpSpy.calls.count()).toEqual(0);
    expect(countUpStartSpy.calls.count()).toEqual(0);
  });
});
