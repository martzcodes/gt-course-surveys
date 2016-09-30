(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Auth', Auth);

  /** @ngInject */
  function Auth($q, $filter, User, firebase, errorCode) {
    var gtGravatarUrl = $filter('gtGravatarUrl');

    var currentUser = null;

    firebase.auth().onAuthStateChanged(function (user) {
      currentUser = user;
    });

    var service = {
      getCurrentUserSync: getCurrentUserSync,

      waitForCurrentUser: waitForCurrentUser,
      requireCurrentUser: requireCurrentUser,
      waitForCurrentUserData: waitForCurrentUserData,
      requireCurrentUserData: requireCurrentUserData,

      anonymous: {
        signIn: anonymousSignIn
      },

      email: {
        register: emailRegister,
        setPassword: emailSetPassword,
        resetPassword: emailSendPasswordReset,
        verifyPasswordResetCode: emailVerifyPasswordResetCode,
        signIn: emailSignIn,
        updatePassword: emailUpdatePassword
      },

      social: {
        signIn: socialSignIn
      },

      signOut: signOut
    };

    return service;

    //////////

    /**
     * Gets the current user's authentication state (sync).
     *
     * @return {?User}
     */
    function getCurrentUserSync() {
      var user = null;

      if (currentUser) {
        user = currentUser;
        user.id = currentUser.uid;
      }

      return user;
    }

    /**
     * Gets the user's authentication state (async).
     *
     * @return {!Promise(?User)}
     */
    function waitForCurrentUser() {
      var deferred = $q.defer();

      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          user.id = user.uid;
          deferred.resolve(user);
        } else {
          deferred.resolve(null);
        }
      });

      return deferred.promise;
    }

    /**
     * Gets the current user's authentication state (async).
     *
     * @return {!Promise(!User)}
     */
    function requireCurrentUser() {
      var deferred = $q.defer();

      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          user.id = user.uid;
          deferred.resolve(user);
        } else {
          deferred.reject(errorCode.USER_REQUIRED);
        }
      });

      return deferred.promise;
    }

    /**
     * Gets the current user's data.
     *
     * @return {!Promise(?User)}
     */
    function waitForCurrentUserData() {
      var deferred = $q.defer();

      requireCurrentUser()
      .then(function (user) {
        return User.get(user.id);
      })
      .then(deferred.resolve)
      .catch(function () {
        deferred.resolve(null);
      });

      return deferred.promise;
    }

    /**
     * Gets the current user's data.
     *
     * @return {!Promise(!User)}
     */
    function requireCurrentUserData() {
      var deferred = $q.defer();

      requireCurrentUser()
      .then(function (user) {
        return User.get(user.id);
      })
      .then(deferred.resolve)
      .catch(function () {
        deferred.reject(errorCode.USER_REQUIRED);
      });

      return deferred.promise;
    }

    /**
     * Signs in anonymously.
     *
     * @return {!Promise()}
     */
    function anonymousSignIn() {
      return $q.when(firebase.auth().signInAnonymously());
    }

    /**
     * Signs in using a 3rd party provider.
     *
     * TODO: Mobile Support
     *
     * GOOGLE
     * https://firebase.google.com/docs/auth/web/google-signin
     * https://developers.google.com/identity/protocols/googlescopes
     *
     * FACEBOOK
     * https://firebase.google.com/docs/auth/web/facebook-login
     * https://developers.facebook.com/docs/facebook-login/permissions
     *
     * TWITTER
     * https://firebase.google.com/docs/auth/web/twitter-login
     *
     * GITHUB
     * https://firebase.google.com/docs/auth/web/github-auth
     * https://developer.github.com/v3/oauth/#scopes
     *
     * @param {string} authProviderName 3rd party provider's name.
     * @return {!Promise()}
     */
    function socialSignIn(authProviderName) {
      var provider;

      switch (authProviderName) {
        case 'google':
          provider = new firebase.auth.GoogleAuthProvider();
          provider.addScope('https://www.googleapis.com/auth/userinfo.email');
          provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
          break;

        case 'facebook':
          provider = new firebase.auth.FacebookAuthProvider();
          provider.addScope('email');
          provider.addScope('public_profile');
          break;

        case 'twitter':
          provider = new firebase.auth.TwitterAuthProvider();
          break;

        case 'github':
          provider = new firebase.auth.GithubAuthProvider();
          provider.addScope('user:email');
          break;

        default:
          return $q.reject('Invalid provider.');
      }

      var deferred = $q.defer();

      function resolve() {
        deferred.resolve();
      }

      function reject(error) {
        signOut();

        deferred.reject(error);
      }

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
          if (!result || !result.user || !result.user.providerData) {
            return reject('There was an error. Please try again.');
          }

          var providerData = result.user.providerData[0] || {};

          // Twitter does not provide email...
          // if (!providerData.email) {
          //   return reject('Email must be provided.');
          // }

          if (!providerData.displayName || !providerData.photoURL) {
            return reject('Name and picture must be provided.');
          }

          User.get(result.user.uid).then(function (userData) {
            var task;

            if (userData) {
              task = User.update(userData, {
                email: providerData.email,
                name: providerData.displayName,
                profileImageUrl: providerData.photoURL
              });
            } else {
              task = createUserRecord(result.user.uid,
                                      authProviderName,
                                      providerData.email,
                                      providerData.displayName,
                                      providerData.photoURL);
            }

            task.then(resolve).catch(reject);
          }).catch(reject);
        }).catch(reject);

      return deferred.promise;
    }

    /**
     * Registers a user account.
     *
     * @param {string} email
     * @param {string} name
     * @return {!Promise()}
     */
    function emailRegister(email, name) {
      var deferred = $q.defer();

      email = angular.lowercase(email);

      var password = getSecurePassword();

      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function (user) {
        return createUserRecord(user.uid,
                                'password',
                                user.email || email,
                                user.displayName || name,
                                user.photoURL);
      })
      .then(function () {
        return signOut();
      })
      .then(function () {
        return emailSendPasswordReset(email);
      })
      .then(deferred.resolve)
      .catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Generates a random, secure password.
     *
     * @return {string} Password.
     * @private
     */
    function getSecurePassword() {
      var c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?_-';
      var p = [];

      while (p.length < 16) {
        p.push(c[Math.floor(Math.random() * c.length)]);
      }

      return p.join('');
    }

    /**
     * Creates a user record in the /users node of the database.
     *
     * @param {string} id
     * @param {string} authProviderName
     * @param {string} email
     * @param {string} name
     * @param {string} profileImageUrl
     * @return {!Promise()}
     */
    function createUserRecord(id, authProviderName, email, name, profileImageUrl) {
      return User.set(id, {
        authProvider: authProviderName,
        email: email || null,
        name: name,
        profileImageUrl: profileImageUrl || gtGravatarUrl(email),
        anonymous: false
      });
    }

    /**
     * Sends a password reset email.
     *
     * @param {string} email
     * @return {!Promise()}
     */
    function emailSendPasswordReset(email) {
      return $q.when(firebase.auth().sendPasswordResetEmail(email));
    }

    /**
     * Verifies a password reset code.
     *
     * @param {string} code
     * @return {!Promise(?string)} Resolves with user's email if code is valid, null otherwise.
     */
    function emailVerifyPasswordResetCode(code) {
      if (!code || !angular.isString(code)) {
        return $q.resolve(null);
      }

      var deferred = $q.defer();

      firebase
        .auth()
        .verifyPasswordResetCode(code)
        .then(deferred.resolve)
        .catch(function () {
          deferred.resolve(null);
        });

      return deferred.promise;
    }

    /**
     * Sets a user's password.
     *
     * @param {string} code
     * @param {string} password
     * @return {!Promise()}
     */
    function emailSetPassword(code, password) {
      return $q.when(firebase.auth().confirmPasswordReset(code, password));
    }

    /**
     * Signs in a user.
     *
     * @param {string} email
     * @param {string} password
     * @return {!Promise()}
     */
    function emailSignIn(email, password) {
      return $q.when(firebase.auth().signInWithEmailAndPassword(email, password));
    }

    /**
     * Updates a user's password.
     *
     * @param {string} email
     * @param {string} passwordOld
     * @param {string} passwordNew
     * @return {!Promise()}
     */
    function emailUpdatePassword(email, passwordOld, passwordNew) {
      var deferred = $q.defer();

      currentUser.reauthenticate(firebase.auth.EmailAuthProvider.credential(email, passwordOld))
      .then(function () {
        currentUser.updatePassword(passwordNew);
      })
      .then(deferred.resolve)
      .catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Signs out a user.
     *
     * @return {!Promise()}
     */
    function signOut() {
      return $q.when(firebase.auth().signOut());
    }
  }
}());
