'use strict';

describe('Auth', function () {
  var Auth;
  // var msUtils;
  var firebase;
  // var moment;
  // var _;

  var $timeout;

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector) {
    Auth = $injector.get('Auth');
    // msUtils = $injector.get('msUtils');
    firebase = $injector.get('firebase');
    // moment = $injector.get('moment');
    // _ = $injector.get('_');

    $timeout = $injector.get('$timeout');

    $timeout.flush();
  }));

  describe('Auth.getCurrentUserSync', function () {
    var expectedUser;
    var observedUser;
    var onAuthStateChangedCallback;

    beforeEach(function () {
      onAuthStateChangedCallback = firebase.authCallbacks[0];
    });

    it('registers an auth state change callback', function () {
      expect(firebase.authCallbacks.length).toBeGreaterThan(0);
    });

    it('returns null if not authenticated', function () {
      expectedUser = null;

      onAuthStateChangedCallback(expectedUser);
      observedUser = Auth.getCurrentUserSync();

      expect(observedUser).toEqual(expectedUser);
    });

    it('returns current user if authenticated', function () {
      expectedUser = { foo: 'bar', uid: 'some-id' };

      onAuthStateChangedCallback(expectedUser);
      observedUser = Auth.getCurrentUserSync();

      expect(observedUser).toEqual(jasmine.objectContaining(expectedUser));
      expect(observedUser.id).toEqual(expectedUser.uid);
    });
  });
});
