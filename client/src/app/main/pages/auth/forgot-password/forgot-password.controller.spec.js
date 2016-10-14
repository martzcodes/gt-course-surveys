'use strict';

describe('controller: ForgotPasswordController', function () {
  var $controller;
  var $timeout;
  var $q;
  var $state;

  var Auth;
  var msUtils;

  var vm;
  var translations = { FORGOTPASSWORD: { EMAIL_SENT: 'Email sent.' } };

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
    spyOn(Auth.email, 'resetPassword').and.returnValue($q.resolve());

    msUtils = $injector.get('msUtils');
    spyOn(msUtils, 'toast');
  }));

  it('inits user email from url', function () {
    vm = $controller('ForgotPasswordController', {
      $stateParams: { e: user.email },
      user: null
    });

    expect(vm.user.email).toEqual(user.email);
  });

  it('inits user email as empty if absent in url', function () {
    vm = $controller('ForgotPasswordController', {
      $stateParams: {},
      user: null
    });

    expect(vm.user.email).toEqual('');
  });

  it('navigates to profile if authenticated', function () {
    vm = $controller('ForgotPasswordController', {
      $stateParams: {},
      user: { email: user.email }
    });

    expect($state.go).toHaveBeenCalledWith('app.account_profile');
  });

  it('does not navigate to profile if not authenticated', function () {
    vm = $controller('ForgotPasswordController', {
      $stateParams: {},
      user: null
    });

    expect($state.go).not.toHaveBeenCalled();
  });

  describe('vm.sendResetLink', function () {
    beforeEach(function () {
      vm = $controller('ForgotPasswordController', {
        $stateParams: {},
        user: null
      });
    });

    it('starts working on reset request', function () {
      vm.sendResetLink(user.email);
      expect(vm.working).toBe(true);
    });

    it('sends reset password email', function () {
      vm.sendResetLink(user.email);
      $timeout.flush();
      expect(vm.working).toBe(false);
      expect(Auth.email.resetPassword).toHaveBeenCalledWith(user.email);
      expect(msUtils.toast).toHaveBeenCalledWith(translations.FORGOTPASSWORD.EMAIL_SENT);
    });

    it('stops working on error', function () {
      var error = { message: 'error' };
      Auth.email.resetPassword.and.returnValue($q.reject(error));
      vm.sendResetLink(user.email);
      $timeout.flush();
      expect(vm.working).toBe(false);
      expect(msUtils.toast).toHaveBeenCalledWith(error);
    });
  });
});
