'use strict';

describe('controller: LoginController', function () {
  var $controller;
  var $timeout;
  var $q;
  var $state;

  var Auth;
  var msUtils;

  var vm;
  var translations = {};

  var user = {
    name: 'Test',
    email: 'test@test.test',
    password: '12341234'
  };

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', translations);
  }));

  beforeEach(inject(function ($injector) {
    $controller = $injector.get('$controller');
    $timeout = $injector.get('$timeout');
    $q = $injector.get('$q');

    $state = $injector.get('$state');
    spyOn($state, 'go');

    Auth = $injector.get('Auth');
    spyOn(Auth.email, 'signIn').and.returnValue($q.resolve());
    spyOn(Auth.social, 'signIn').and.returnValue($q.resolve());

    msUtils = $injector.get('msUtils');
    spyOn(msUtils, 'toast');
  }));

  it('inits user email and password from url', function () {
    vm = $controller('LoginController', {
      $stateParams: { e: user.email, p: user.password },
      user: null
    });

    expect(vm.user.email).toEqual(user.email);
    expect(vm.user.password).toEqual(user.password);
  });

  it('inits user email and password as empty if absent in url', function () {
    vm = $controller('LoginController', {
      $stateParams: {},
      user: null
    });

    expect(vm.user.email).toEqual('');
    expect(vm.user.password).toEqual('');
    expect($state.go).not.toHaveBeenCalled();
  });

  it('navigates to profile if authenticated', function () {
    vm = $controller('LoginController', {
      $stateParams: {},
      user: { email: user.email }
    });

    expect($state.go).toHaveBeenCalledWith('app.account_profile');
  });

  it('authenticates if email and password are available', function () {
    vm = $controller('LoginController', {
      $stateParams: { e: user.email, p: user.password },
      user: null
    });

    expect(Auth.email.signIn).toHaveBeenCalledWith(user.email, user.password);
  });

  describe('vm.loginWithEmail', function () {
    beforeEach(function () {
      vm = $controller('LoginController', {
        $stateParams: {},
        user: null
      });
    });

    it('starts working on login request', function () {
      vm.loginWithEmail(user);
      expect(vm.working).toBe(true);
    });

    it('authenticates', function () {
      vm.loginWithEmail(user);
      $timeout.flush();
      expect(vm.working).toBe(true);
      expect(Auth.email.signIn).toHaveBeenCalledWith(user.email, user.password);
      expect($state.go).toHaveBeenCalledWith('app.account_profile');
    });

    it('stops working on error', function () {
      var error = { message: 'error' };
      Auth.email.signIn.and.returnValue($q.reject(error));
      vm.loginWithEmail(user);
      $timeout.flush();
      expect(vm.working).toBe(false);
      expect(msUtils.toast).toHaveBeenCalledWith(error);
    });
  });

  describe('vm.loginWithSocial', function () {
    var authProvider;

    beforeEach(function () {
      vm = $controller('LoginController', {
        $stateParams: {},
        user: null
      });

      authProvider = { name: 'google' };
    });

    it('starts working on login request', function () {
      vm.loginWithSocial(authProvider);
      expect(vm.working).toBe(true);
    });

    it('authenticates', function () {
      vm.loginWithSocial(authProvider);
      $timeout.flush();
      expect(vm.working).toBe(false);
      expect(Auth.social.signIn).toHaveBeenCalledWith(authProvider.name);
      expect($state.go).toHaveBeenCalledWith('app.account_profile');
    });

    it('stops working on error', function () {
      var error = { message: 'error' };
      Auth.social.signIn.and.returnValue($q.reject(error));
      vm.loginWithSocial(authProvider);
      $timeout.flush();
      expect(vm.working).toBe(false);
      expect(msUtils.toast).toHaveBeenCalledWith(error);
    });
  });
});
