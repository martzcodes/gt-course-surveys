'use strict';

describe('run: Index', function () {
  var $rootScope;
  var $state;
  var $mdDialog;
  var $mdToast;
  var $timeout;
  var $log;

  var errorCode;
  var firebase;
  var firebaseConfig;

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    $mdDialog = $injector.get('$mdDialog');
    $mdToast = $injector.get('$mdToast');
    $timeout = $injector.get('$timeout');
    $log = $injector.get('$log');

    errorCode = $injector.get('errorCode');
    firebase = $injector.get('firebase');
    firebaseConfig = $injector.get('firebaseConfig');

    $timeout.flush();
  }));

  it('initializes firebase', function () {
    expect(firebase.config).toEqual(firebaseConfig);
  });

  it('caches state object to root scope', function () {
    expect($rootScope.state).toEqual($state);
  });

  describe('state change start', function () {
    beforeEach(function () {
      spyOn($mdDialog, 'cancel');
      spyOn($mdToast, 'hide');

      $rootScope.$broadcast('$stateChangeStart');
    });

    it('enables spinner when state transitions start', function () {
      expect($rootScope.loadingProgress).toBe(true);
    });

    it('cancels any dialogs when state transitions start', function () {
      expect($mdDialog.cancel).toHaveBeenCalled();
    });

    it('hides any toasts when state transitions start', function () {
      expect($mdToast.hide).toHaveBeenCalled();
    });
  });

  describe('state change success', function () {
    beforeEach(function () {
      $rootScope.$broadcast('$stateChangeSuccess');
      $timeout.flush();
    });

    it('disables spinner when state transitions succeed', function () {
      expect($rootScope.loadingProgress).toBe(false);
    });
  });

  describe('state change error', function () {
    beforeEach(function () {
      spyOn($state, 'go');
      spyOn($log, 'error');
    });

    it('navigates to login view on USER_REQUIRED error', function () {
      $rootScope.$broadcast('$stateChangeError', null, null, null, null, errorCode.USER_REQUIRED);

      expect($state.go).toHaveBeenCalledWith('app.pages_auth_login');
      expect($log.error).not.toHaveBeenCalled();
    });

    it('navigates to 404 view on HTTP_404 error', function () {
      $rootScope.$broadcast('$stateChangeError', null, null, null, null, errorCode.HTTP_404);

      expect($state.go).toHaveBeenCalledWith('app.pages_errors_error-404');
      expect($log.error).not.toHaveBeenCalled();
    });

    it('navigates to 500 view on HTTP_500 error', function () {
      $rootScope.$broadcast('$stateChangeError', null, null, null, null, errorCode.HTTP_500);

      expect($state.go).toHaveBeenCalledWith('app.pages_errors_error-500');
      expect($log.error).not.toHaveBeenCalled();
    });

    it('logs an error otherwise', function () {
      var error = { foo: 'bar' };
      $rootScope.$broadcast('$stateChangeError', null, null, null, null, error);

      expect($state.go).not.toHaveBeenCalled();
      expect($log.error).toHaveBeenCalledWith(error);
    });
  });
});
