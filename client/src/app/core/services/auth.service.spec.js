'use strict';

describe('service: Auth', function () {
  var Auth;
  var User;
  var firebase;
  var errorCode;
  var _;

  var $timeout;
  var $q;

  var uid = 'uid';
  var email = 'user@domain.com';
  var name = 'name';
  var photoURL = 'photoURL'
  var password = '12341234';
  var passwordOld = '12341234';
  var passwordNew = '12341234';
  var oobCode = 'asdfasdfasdf';
  var credential = 'CREDENTIAL';

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector) {
    Auth = $injector.get('Auth');
    User = $injector.get('User');
    firebase = $injector.get('firebase');
    errorCode = $injector.get('errorCode');
    _ = $injector.get('_');

    $timeout = $injector.get('$timeout');
    $q = $injector.get('$q');

    $timeout.flush();
  }));

  describe('getCurrentUserSync', function () {
    var expectedUser;
    var observedUser;

    it('registers an auth state change callback', function () {
      expect(firebase.auth().callbacks.length).toBeGreaterThan(0);
    });

    it('returns null if not authenticated', function () {
      expectedUser = null;
      firebase.auth().setUser(expectedUser);

      observedUser = Auth.getCurrentUserSync();

      expect(observedUser).toEqual(expectedUser);
    });

    it('returns current user if authenticated', function () {
      expectedUser = { foo: 'bar', uid: 'some-id' };
      firebase.auth().setUser(expectedUser);

      observedUser = Auth.getCurrentUserSync();

      expect(observedUser).toEqual(jasmine.objectContaining(expectedUser));
      expect(observedUser.id).toEqual(expectedUser.uid);
    });
  });

  describe('waitForCurrentUser', function () {
    var expectedUser;

    it('resolves with current user if authenticated', function (done) {
      expectedUser = { uid: uid, email: email };
      firebase.auth().user = expectedUser;

      Auth.waitForCurrentUser().then(function (observedUser) {
        expect(observedUser).toEqual(jasmine.objectContaining(expectedUser))
        expect(observedUser.id).toEqual(expectedUser.uid);
        done();
      });

      $timeout.flush();
    });

    it('resolves with null if not authenticated', function (done) {
      expectedUser = null;
      firebase.auth().user = expectedUser;

      Auth.waitForCurrentUser().then(function (observedUser) {
        expect(observedUser).toEqual(expectedUser);
        done();
      });

      $timeout.flush();
    });
  });

  describe('waitForCurrentUserData', function () {
    var userAuth;
    var userData;

    beforeEach(function () {
      userAuth = { uid: uid, email: email };
      userData = { uid: uid, id: uid, email: email, name: name, anonymous: false };

      spyOn(User, 'get').and.returnValue($q.resolve(userData));
    });

    afterEach(function () {
      User.get.calls.reset();
    });

    it('resolves with user data if authenticated', function (done) {
      firebase.auth().user = userAuth;

      Auth.waitForCurrentUserData().then(function (data) {
        expect(User.get).toHaveBeenCalledWith(userAuth.uid);
        expect(data).toEqual(userData);
        done();
      });

      $timeout.flush();
    });

    it('resolves with null if not authenticated', function (done) {
      firebase.auth().user = null;

      Auth.waitForCurrentUserData().then(function (data) {
        expect(User.get).not.toHaveBeenCalled();
        expect(data).toBeNull();
        done();
      });

      $timeout.flush();
    });
  });

  describe('requireCurrentUserData', function () {
    var userAuth;
    var userData;

    beforeEach(function () {
      userAuth = { uid: uid, id: uid, email: email };
      userData = { uid: uid, id: uid, email: email, name: name, anonymous: false };

      spyOn(User, 'get').and.returnValue($q.resolve(userData));
    });

    afterEach(function () {
      User.get.calls.reset();
    });

    it('resolves with user data if authenticated', function (done) {
      firebase.auth().user = userAuth;

      Auth.requireCurrentUserData().then(function (data) {
        expect(User.get).toHaveBeenCalledWith(userAuth.uid);
        expect(data).toEqual(userData);
        done();
      });

      $timeout.flush();
    });

    it('rejects if not authenticated', function (done) {
      firebase.auth().user = null;

      Auth.requireCurrentUserData().catch(function (error) {
        expect(User.get).not.toHaveBeenCalled();
        expect(error).toEqual(errorCode.USER_REQUIRED);
        done();
      });

      $timeout.flush();
    });
  });

  describe('anonymous.signIn', function () {
    it('signs in anonymously', function (done) {
      Auth.anonymous.signIn().then(function () {
        expect(firebase.auth().signInAnonymously).toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });
  });

  describe('social.signIn', function () {
    var signInResult;
    var addScopeSpy;
    var providers;
    var defaultError = 'There was an error. Please try again.';
    var accessError = 'Name and picture must be provided.';
    var userGetSpy;
    var userUpdateSpy;
    var userSetSpy;

    beforeEach(function () {
      signInResult = {
        user: {
          uid: uid,
          providerData: [{
            email: email,
            displayName: [name, name, name].join(' '),
            photoURL: photoURL + '&key=value'
          }]
        }
      };
      firebase.auth().signInWithPopup = jasmine.createSpy().and.returnValue($q.resolve(signInResult));

      userGetSpy = spyOn(User, 'get').and.returnValue($q.resolve(null));
      userUpdateSpy = spyOn(User, 'update').and.returnValue($q.resolve(null));
      userSetSpy = spyOn(User, 'set').and.returnValue($q.resolve(null));

      addScopeSpy = jasmine.createSpy('addScope');

      providers = [
        'GoogleAuthProvider',
        'FacebookAuthProvider',
        'TwitterAuthProvider',
        'GithubAuthProvider'
      ];

      _.forEach(providers, function (provider) {
        firebase.auth[provider] = function () { this.provider = provider; };
        firebase.auth[provider].prototype.addScope = addScopeSpy;
      });

      firebase.auth().signOut.calls.reset();
    });

    afterEach(function () {
      firebase.auth().signInWithPopup.and.returnValue($q.resolve(signInResult));

      userGetSpy.and.returnValue($q.resolve(null));
      userGetSpy.calls.reset();

      userUpdateSpy.and.returnValue($q.resolve(null));
      userUpdateSpy.calls.reset();

      userSetSpy.and.returnValue($q.resolve(null));
      userSetSpy.calls.reset();

      addScopeSpy.calls.reset();
    });

    it('rejects an invalid provider', function (done) {
      Auth.social.signIn('junk').catch(function (result) {
        expect(result).toEqual('Invalid provider.');
        done();
      });

      $timeout.flush();
    });

    it('authenticates with google', function (done) {
      Auth.social.signIn('google').then(function () {
        expect(firebase.auth().signInWithPopup.calls.mostRecent().args[0].provider).toEqual('GoogleAuthProvider');
        expect(addScopeSpy).toHaveBeenCalledWith('https://www.googleapis.com/auth/userinfo.email');
        expect(addScopeSpy).toHaveBeenCalledWith('https://www.googleapis.com/auth/userinfo.profile');
        done();
      });

      $timeout.flush();
    });

    it('authenticates with facebook', function (done) {
      Auth.social.signIn('facebook').then(function () {
        expect(firebase.auth().signInWithPopup.calls.mostRecent().args[0].provider).toEqual('FacebookAuthProvider');
        expect(addScopeSpy).toHaveBeenCalledWith('email');
        expect(addScopeSpy).toHaveBeenCalledWith('public_profile');
        done();
      });

      $timeout.flush();
    });

    it('authenticates with twitter', function (done) {
      Auth.social.signIn('twitter').then(function () {
        expect(firebase.auth().signInWithPopup.calls.mostRecent().args[0].provider).toEqual('TwitterAuthProvider');
        done();
      });

      $timeout.flush();
    });

    it('authenticates with github', function (done) {
      Auth.social.signIn('github').then(function () {
        expect(firebase.auth().signInWithPopup.calls.mostRecent().args[0].provider).toEqual('GithubAuthProvider');
        expect(addScopeSpy).toHaveBeenCalledWith('user:email');
        done();
      });

      $timeout.flush();
    });

    it('rejects if sign in is unsuccessful', function (done) {
      var error = 'ERROR';
      firebase.auth().signInWithPopup.and.returnValue($q.reject(error));

      Auth.social.signIn('google').catch(function (result) {
        expect(firebase.auth().signOut).toHaveBeenCalled();
        expect(result).toEqual(error);
        done();
      });

      $timeout.flush();
    });

    it('rejects if sign in result is invalid', function (done) {
      signInResult = null;
      firebase.auth().signInWithPopup.and.returnValue($q.resolve(signInResult));

      Auth.social.signIn('google').catch(function (result) {
        expect(firebase.auth().signOut).toHaveBeenCalled();
        expect(result).toEqual(defaultError);
        done();
      });

      $timeout.flush();
    });

    it('rejects if access for name or photo has not been granted', function (done) {
      signInResult = { user: { providerData: [] } };
      firebase.auth().signInWithPopup.and.returnValue($q.resolve(signInResult));

      Auth.social.signIn('google').catch(function (result) {
        expect(firebase.auth().signOut).toHaveBeenCalled();
        expect(result).toEqual(accessError);
        done();
      });

      $timeout.flush();
    });

    it('creates user record if not previously registered', function (done) {
      var userData = null;
      userGetSpy.and.returnValue($q.resolve(userData));

      var twitterSignInResult = _.cloneDeep(signInResult);
      _.unset(twitterSignInResult, ['user', 'providerData', 0, 'email']);
      firebase.auth().signInWithPopup.and.returnValue($q.resolve(twitterSignInResult));

      Auth.social.signIn('twitter').then(function () {
        expect(User.get).toHaveBeenCalledWith(signInResult.user.uid);
        expect(User.update).not.toHaveBeenCalled();
        expect(User.set).toHaveBeenCalledWith(signInResult.user.uid, {
          authProvider: 'twitter',
          email: null,
          name: signInResult.user.providerData[0].displayName,
          profileImageUrl: signInResult.user.providerData[0].photoURL,
          anonymous: false
        });
        done();
      });

      $timeout.flush();
    });

    it('updates user record if previously registered', function (done) {
      var userData = {
        id: uid,
        name: name,
        email: email,
        profileImageUrl: 'https://domain.com/file.png',
        anonymous: true
      };

      userGetSpy.and.returnValue($q.resolve(userData));

      Auth.social.signIn('google').then(function () {
        expect(User.get).toHaveBeenCalledWith(signInResult.user.uid);
        expect(User.update).toHaveBeenCalledWith(userData, {
          email:           signInResult.user.providerData[0].email,
          name:            signInResult.user.providerData[0].displayName,
          profileImageUrl: signInResult.user.providerData[0].photoURL
        });
        done();
      });

      $timeout.flush();
    });
  });

  describe('email.register', function () {
    var user;

    beforeEach(function () {
      user = {
        uid: uid,
        email: email,
        displayName: [name, name].join(' '),
        photoURL: photoURL
      };

      firebase.auth().createUserWithEmailAndPassword = jasmine.createSpy().and.returnValue($q.resolve(user));

      spyOn(User, 'set').and.returnValue($q.resolve());

      firebase.auth().signOut.calls.reset();
      firebase.auth().sendPasswordResetEmail.calls.reset();
    });

    afterEach(function () {
      User.set.calls.reset();
    });

    it('registers a user', function (done) {
      Auth.email.register(email.toUpperCase(), name).then(function () {
        var args = firebase.auth().createUserWithEmailAndPassword.calls.mostRecent().args;
        expect(args[0]).toEqual(email);
        expect(args[1]).toMatch(/^[a-zA-Z0-9!\?_-]{16}$/);

        expect(User.set).toHaveBeenCalledWith(user.uid, {
          authProvider: 'password',
          email: user.email,
          name: user.displayName,
          profileImageUrl: user.photoURL,
          anonymous: false
        });

        expect(firebase.auth().signOut).toHaveBeenCalled();
        expect(firebase.auth().sendPasswordResetEmail).toHaveBeenCalledWith(email);
        done();
      });

      $timeout.flush();
    });

    it('defaults attributes when creating a user record', function (done) {
      user.email = null;
      user.displayName = null;
      user.photoURL = null;

      Auth.email.register(email, name).then(function () {
        expect(User.set).toHaveBeenCalledWith(user.uid, {
          authProvider: 'password',
          email: email,
          name: name,
          profileImageUrl: 'https://www.gravatar.com/avatar/cd2bfcffe5fee4a1149d101994d0987f?s=200&d=mm',
          anonymous: false
        });
        done();
      });

      $timeout.flush();
    });
  });

  describe('email.verifyPasswordResetCode', function () {
    it('resolves with null if input is missing', function (done) {
      Auth.email.verifyPasswordResetCode().then(function (result) {
        expect(result).toBeNull();
        done();
      });

      $timeout.flush();
    });

    it('resolves with null for invalid input', function (done) {
      Auth.email.verifyPasswordResetCode('').then(function (result) {
        expect(result).toBeNull();
        done();
      });

      $timeout.flush();
    });

    it('resolves with null on error', function (done) {
      firebase.auth().verifyPasswordResetCode = jasmine.createSpy().and.returnValue($q.reject());

      Auth.email.verifyPasswordResetCode(oobCode).then(function (result) {
        expect(result).toBeNull();
        expect(firebase.auth().verifyPasswordResetCode).toHaveBeenCalledWith(oobCode);
        done();
      });

      $timeout.flush();
    });

    it('resolves with email on success', function (done) {
      firebase.auth().verifyPasswordResetCode = jasmine.createSpy().and.returnValue($q.resolve(email));

      Auth.email.verifyPasswordResetCode(oobCode).then(function (result) {
        expect(result).toEqual(email);
        expect(firebase.auth().verifyPasswordResetCode).toHaveBeenCalledWith(oobCode);
        done();
      });

      $timeout.flush();
    });
  });

  describe('email.setPassword', function () {
    it('resets the user password', function (done) {
      firebase.auth().confirmPasswordReset = jasmine.createSpy().and.returnValue($q.resolve());

      Auth.email.setPassword(oobCode, password).then(function () {
        expect(firebase.auth().confirmPasswordReset).toHaveBeenCalledWith(oobCode, password);
        done();
      });

      $timeout.flush();
    });
  });

  describe('email.resetPassword', function () {
    it('sends the reset password email', function (done) {
      Auth.email.resetPassword(email).then(function () {
        expect(firebase.auth().sendPasswordResetEmail).toHaveBeenCalledWith(email);
        done();
      });

      $timeout.flush();
    });
  });

  describe('email.signIn', function () {
    it('signs the user in', function (done) {
      Auth.email.signIn(email, password).then(function () {
        expect(firebase.auth().signInWithEmailAndPassword).toHaveBeenCalledWith(email, password);
        done();
      });

      $timeout.flush();
    });
  });

  describe('email.updatePassword', function () {
    var user;

    beforeEach(function () {
      firebase.auth.EmailAuthProvider = {
        credential: jasmine.createSpy().and.returnValue(credential)
      };

      user = {
        reauthenticate: jasmine.createSpy().and.returnValue($q.resolve()),
        updatePassword: jasmine.createSpy().and.returnValue($q.resolve())
      };
      firebase.auth().setUser(user);
    });

    it('updates the user\'s password', function (done) {
      Auth.email.updatePassword(email, passwordOld, passwordNew).then(function () {
        expect(firebase.auth.EmailAuthProvider.credential).toHaveBeenCalledWith(email, passwordOld);
        expect(user.reauthenticate).toHaveBeenCalledWith(credential);
        expect(user.updatePassword).toHaveBeenCalledWith(passwordNew);
        done();
      });

      $timeout.flush();
    });
  });

  describe('signOut', function () {
    it('signs the user out', function (done) {
      Auth.signOut().then(function () {
        expect(firebase.auth().signOut).toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });
  });
});
