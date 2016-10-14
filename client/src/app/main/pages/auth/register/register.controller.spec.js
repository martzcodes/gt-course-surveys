'use strict';

describe('controller: RegisterController', function () {
  var $controller;
  var $timeout;
  var $q;
  var $state;

  var Auth;
  var msUtils;

  var vm;
  var translations = { REGISTER: { CREATED: 'Account created.' } };

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
    spyOn(Auth.email, 'register').and.returnValue($q.resolve());

    msUtils = $injector.get('msUtils');
    spyOn(msUtils, 'toast');
  }));

  it('navigates to profile if authenticated', function () {
    vm = $controller('RegisterController', {
      $stateParams: {},
      user: { name: user.name, email: user.email }
    });

    expect($state.go).toHaveBeenCalledWith('app.account_profile');
  });

  describe('vm.register', function () {
    beforeEach(function () {
      vm = $controller('RegisterController', {
        $stateParams: {},
        user: null
      });
    });

    it('starts working on register request', function () {
      vm.register(user);
      expect(vm.working).toBe(true);
    });

    it('registers user', function () {
      vm.register(user);
      $timeout.flush();
      expect(vm.working).toBe(false);
      expect(Auth.email.register).toHaveBeenCalledWith(user.email, user.name);
      expect(msUtils.toast).toHaveBeenCalledWith(translations.REGISTER.CREATED);
    });

    it('stops working on error', function () {
      var error = { message: 'error' };
      Auth.email.register.and.returnValue($q.reject(error));
      vm.register(user);
      $timeout.flush();
      expect(vm.working).toBe(false);
      expect(msUtils.toast).toHaveBeenCalledWith(error);
    });
  });
});
