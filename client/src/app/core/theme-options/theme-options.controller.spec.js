'use strict';

describe('controller: MsThemeOptionsController', function () {
  var $window;
  var $cookies;

  var fuseTheming;
  var vm;

  beforeEach(module('app'));

  beforeEach(inject(function ($injector, $controller) {
    $window = { location: { reload: jasmine.createSpy('$window.location.reload') } };
    $cookies = $injector.get('$cookies');

    spyOn($cookies, 'put');

    fuseTheming = $injector.get('fuseTheming');

    vm = $controller('MsThemeOptionsController', {
      $window: $window,
      $cookies: $cookies
    });
  }));

  describe('vm.setActiveTheme', function () {
    var themeName;

    beforeEach(function () {
      themeName = 'theme-name';

      spyOn(fuseTheming, 'setActiveTheme');
    });

    it('sets the active theme', function () {
      vm.setActiveTheme(themeName);
      expect(fuseTheming.setActiveTheme).toHaveBeenCalledWith(themeName);
    });
  });

  describe('vm.getActiveTheme', function () {
    var activeTheme;

    beforeEach(function () {
      fuseTheming.themes.active = activeTheme = 'active-theme';
    });

    it('gets the active theme', function () {
      expect(vm.getActiveTheme()).toEqual(activeTheme);
    });
  });

  describe('vm.updateLayoutMode', function () {
    beforeEach(function () {
      angular.element('body').removeClass('boxed');
    });

    it('toggles boxed mode on', function () {
      vm.layoutMode = 'wide';
      vm.updateLayoutMode();
      expect(angular.element('body').hasClass('boxed')).toBe(false);
    });

    it('toggles boxed mode off', function () {
      vm.layoutMode = 'boxed';
      vm.updateLayoutMode();
      expect(angular.element('body').hasClass('boxed')).toBe(true);
    });
  });

  describe('vm.updateLayoutStyle', function () {
    var layoutStyle;

    beforeEach(function () {
      layoutStyle = 'layout-style';
    });

    it('updates the layout style', function () {
      vm.layoutStyle = layoutStyle;
      vm.updateLayoutStyle();
      expect($cookies.put).toHaveBeenCalledWith('ls', layoutStyle);
      expect($window.location.reload).toHaveBeenCalled();
    });
  });
});
