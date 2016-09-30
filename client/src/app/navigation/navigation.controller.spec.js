'use strict';

describe('controller: NavigationController', function () {
  var vm;

  beforeEach(module('app'));

  beforeEach(inject(function ($controller) {
    vm = $controller('NavigationController');
  }));

  it('starts unfolded', function () {
    expect(vm.folded).toBe(false);
  });

  it('supresses horizontal scrollbar', function () {
    expect(vm.msScrollOptions).toEqual({
      suppressScrollX: true
    });
  });

  describe('vm.toggleMsNavigationFolded', function () {
    it('toggles folded when unfolded', function () {
      vm.folded = false;
      vm.toggleMsNavigationFolded();

      expect(vm.folded).toBe(true);
    });

    it('toggles unfolded when folded', function () {
      vm.folded = true;
      vm.toggleMsNavigationFolded();

      expect(vm.folded).toBe(false);
    });
  });
});
