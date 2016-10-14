'use strict';

describe('controller: SetPasswordController', function () {
  var $controller;
  var $timeout;
  var $q;
  var $state;
  var $mdToast;

  var Auth;
  var msUtils;

  var vm;
  var translations = {
    SETPASSWORD: {
      INVALID_OR_EXPIRED: 'Invalid.',
      REQUEST_NEW_LINK: 'Get new.'
    }
  };

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

    $mdToast = $injector.get('$mdToast');
    spyOn($mdToast, 'show').and.returnValue($q.resolve());

    $state = $injector.get('$state');
    spyOn($state, 'go');

    Auth = $injector.get('Auth');
    spyOn(Auth.email, 'setPassword').and.returnValue($q.resolve());
    spyOn(Auth.email, 'signIn').and.returnValue($q.resolve());

    msUtils = $injector.get('msUtils');
    spyOn(msUtils, 'toast');
  }));

  it('navigates to profile if authenticated', function () {
    vm = $controller('SetPasswordController', {
      $stateParams: {},
      user: { name: user.name, email: user.email },
      email: null
    });

    expect($state.go).toHaveBeenCalledWith('app.account_profile');
  });

  it('inits user email if oob code is valid', function () {
    vm = $controller('SetPasswordController', {
      $stateParams: {},
      user: null,
      email: user.email // oob code is mapped to user's email
    });

    expect(vm.user.email).toEqual(user.email);
  });

  it('shows invalid or expired message if oob code is invalid', function () {
    vm = $controller('SetPasswordController', {
      $stateParams: {},
      user: null,
      email: null
    });

    $timeout.flush();

    expect(vm.user.email).toBeNull();
    expect($mdToast.show).toHaveBeenCalled();
    expect($state.go).toHaveBeenCalledWith('app.pages_auth_forgot-password');
  });

  describe('vm.setPassword', function () {
    var oobCode = 'abcdabcd';

    beforeEach(function () {
      vm = $controller('SetPasswordController', {
        $stateParams: { oobCode: oobCode },
        user: null,
        email: user.email
      });
    });

    it('starts working on set password request', function () {
      vm.setPassword(user);
      expect(vm.working).toBe(true);
    });

    it('sets password and authenticates', function () {
      vm.setPassword(user);
      $timeout.flush();
      expect(vm.working).toBe(true);
      expect(Auth.email.setPassword).toHaveBeenCalledWith(oobCode, user.password);
      expect(Auth.email.signIn).toHaveBeenCalledWith(user.email, user.password);
      expect($state.go).toHaveBeenCalledWith('app.account_profile');
    });

    it('stops working on error', function () {
      var error = { message: 'error' };
      Auth.email.setPassword.and.returnValue($q.reject(error));
      vm.setPassword(user);
      $timeout.flush();
      expect(vm.working).toBe(false);
      expect($mdToast.show).toHaveBeenCalled();
    });
  });
});
