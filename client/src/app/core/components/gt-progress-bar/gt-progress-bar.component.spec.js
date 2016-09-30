'use strict';

describe('component: gtProgressBar', function () {
  var $componentController;
  var vm;

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector) {
    $componentController = $injector.get('$componentController');
  }));

  it('defaults value to 0', function () {
    vm = $componentController('gtProgressBar', null, {
      value: null,
      max: 100
    });

    expect(vm.value).toEqual(0);
  });

  it('defaults max to 100', function () {
    vm = $componentController('gtProgressBar', null, {
      value: 20,
      max: null
    });

    expect(vm.max).toEqual(100);
  });

  it('calculates percentage from value and max', function () {
    vm = $componentController('gtProgressBar', null, {
      value: 1,
      max: 9
    });

    expect(vm.percent).toEqual(11.1);
  });
});
