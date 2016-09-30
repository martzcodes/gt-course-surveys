'use strict';

describe('controller: ProfileController', function () {
  var $controller;
  var $rootScope;
  var $timeout;
  var $q;

  var eventCode;
  var User;
  var userUpdateSpy;
  var msUtils;
  var Auth;

  var vm;
  var user;
  var userUpdated;
  var translations = {
    CORE: { UPDATED: 'Updated.' },
    PROFILE: { PASSWORD_NO_MATCH: 'Passwords do not match.' }
  };

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', translations);
  }));

  beforeEach(inject(function ($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');
    $q = $injector.get('$q');

    eventCode = $injector.get('eventCode');
    User = $injector.get('User');
    msUtils = $injector.get('msUtils');
    Auth = $injector.get('Auth');

    user = {
      id: 'foo',
      name: 'bar',
      specialization: 1,
      anonymous: false,
      email: 'foo@bar.com'
    };
    userUpdated = {
      id: 'foo',
      name: 'baz',
      specialization: 3,
      anonymous: true,
      email: 'foo@bar.com'
    };

    spyOn($rootScope, '$broadcast').and.callThrough();
    userUpdateSpy = spyOn(User, 'update').and.returnValue($q.resolve(userUpdated));
    spyOn(msUtils, 'toast');
    spyOn(Auth.email, 'updatePassword').and.returnValue($q.resolve());

    vm = $controller('ProfileController', { user: user });
  }));

  it('inits as not working', function () {
    expect(vm.working).toBe(false);
  });

  it('caches user and a copy', function () {
    expect(vm.user).toBe(user);
    expect(vm.temp).toEqual(user);
  });

  describe('init', function () {
    it('broadcasts user updated event', function () {
      expect($rootScope.$broadcast).toHaveBeenCalledWith(eventCode.USER_UPDATED, user);
    });
  });

  describe('vm.updateAbout', function () {
    it('flips working flag while performing async operations', function () {
      expect(vm.working).toBe(false);
      vm.updateAbout();
      expect(vm.working).toBe(true);
      $timeout.flush();
      expect(vm.working).toBe(false);
    });

    it('updates state with new user data', function () {
      vm.user = user;
      vm.temp = userUpdated;
      vm.updateAbout();
      $timeout.flush();

      expect(vm.working).toBe(false);
      expect(vm.user).toEqual(userUpdated);
      expect($rootScope.$broadcast).toHaveBeenCalledWith(eventCode.USER_UPDATED, userUpdated);
      expect(msUtils.toast).toHaveBeenCalledWith(translations.CORE.UPDATED);
    });

    it('disallows nuking user attributes once set', function () {
      vm.user = user;
      vm.temp = {};
      userUpdateSpy.and.returnValue($q.resolve(user));
      vm.updateAbout();
      $timeout.flush();

      expect(vm.working).toBe(false);
      expect(vm.user).toEqual(user);
      expect($rootScope.$broadcast).toHaveBeenCalledWith(eventCode.USER_UPDATED, user);
      expect(msUtils.toast).toHaveBeenCalledWith(translations.CORE.UPDATED);
    });
  });

  describe('vm.updatePassword', function () {
    it('flips working flag while performing async operations', function () {
      vm.temp.passwordNew = '11111111';
      vm.temp.passwordConfirm = '11111111';

      expect(vm.working).toBe(false);
      vm.updatePassword();
      expect(vm.working).toBe(true);
      $timeout.flush();
      expect(vm.working).toBe(false);
    });

    it('blocks if passwords do not match', function () {
      vm.temp.passwordNew = '11111111';
      vm.temp.passwordConfirm = '11111112';
      vm.updatePassword();
      $timeout.flush();

      expect(vm.working).toBe(false);
      expect(Auth.email.updatePassword).not.toHaveBeenCalled();
      expect(msUtils.toast.calls.count()).toEqual(1);
      expect(msUtils.toast).toHaveBeenCalledWith(translations.PROFILE.PASSWORD_NO_MATCH);
    });

    it('updates user password', function () {
      vm.temp.passwordNew = '11111111';
      vm.temp.passwordConfirm = '11111111';
      vm.temp.passwordCurrent = '22222222';
      vm.updatePassword();
      $timeout.flush();

      expect(vm.working).toBe(false);
      expect(Auth.email.updatePassword).toHaveBeenCalledWith(vm.user.email, vm.temp.passwordCurrent, vm.temp.passwordNew);
      expect(msUtils.toast).toHaveBeenCalledWith(translations.CORE.UPDATED);
    });
  });
});
