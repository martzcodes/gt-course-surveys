'use strict';

describe('IndexController', function () {
  var vm;

  beforeEach(module('app'));

  beforeEach(inject(function ($controller) {
    vm = $controller('IndexController');
  }));

  it('caches themes', inject(function (fuseTheming) {
    expect(vm.themes).toEqual(fuseTheming.themes);
  }));
});
