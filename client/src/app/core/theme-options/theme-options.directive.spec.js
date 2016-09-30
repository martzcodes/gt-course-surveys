'use strict';

describe('directive: msThemeOptions', function () {
  var $rootScope;
  var $compile;
  var $element;

  var $mdSidenavToggle;
  var $mdSidenav;

  beforeEach(module('app', function ($translateProvider, $provide, _) {
    $translateProvider.translations('en', {});

    $mdSidenavToggle = jasmine.createSpy();
    $mdSidenav = jasmine.createSpy().and.returnValue({ toggle: $mdSidenavToggle });

    $provide.factory('$mdSidenav', _.constant($mdSidenav));
  }));

  beforeEach(inject(function ($injector, $templateCache) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');

    $templateCache.put('app/core/theme-options/theme-options.html', '');

    $element = $compile('<ms-theme-options></ms-theme-options>')($rootScope);
    $rootScope.$digest();
  }));

  it('adds ms-theme-options class to the element', function () {
    expect(angular.element($element).hasClass('ms-theme-options')).toBe(true);
  });

  it('toggles options sidenav', function () {
    $rootScope['$$childHead'].toggleOptionsSidenav();
    expect($mdSidenav).toHaveBeenCalledWith('fuse-theme-options');
    expect($mdSidenavToggle).toHaveBeenCalled();
  });
});
