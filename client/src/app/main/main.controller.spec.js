'use strict';

describe('controller: MainController', function () {
  var $rootScope;
  var $scope;

  beforeEach(module('app'));

  beforeEach(inject(function ($injector, $controller) {
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();

    $controller('MainController', {
      $scope: $scope
    });
  }));

  describe('init', function () {
    beforeEach(function () {
      spyOn($rootScope, '$broadcast').and.callThrough();
    });

    it('removes the splash screen when current scope emits $viewContentAnimationEnded', function () {
      $scope.$emit('$viewContentAnimationEnded');

      expect($rootScope.$broadcast).toHaveBeenCalledWith('msSplashScreen::remove');
    });

    it('does not remove the splash screen if another scope emits $viewContentAnimationEnded', function () {
      $rootScope.$broadcast('$viewContentAnimationEnded');

      expect($rootScope.$broadcast.calls.mostRecent().args[0]).not.toEqual('msSplashScreen::remove');
    });
  });
});
