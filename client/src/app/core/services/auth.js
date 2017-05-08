(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Auth', Auth);

  /** @ngInject */
  function Auth($filter, User, gtConfig) {
    const service = {
      waitForUser,
      requireUser,
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
      signOut
    };

    return service;

    //////////

    function waitForUser(authOnly) {
      return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged(async(user) => {
          if (!user) {
            resolve(null);
          } else if (authOnly) {
            resolve(_.assign(user, { _id: user.uid }));
          } else {
            resolve(await User.get(user.uid));
          }
        });
      });
    }

    function requireUser(authOnly) {
      return new Promise((resolve, reject) => {
        waitForUser(authOnly).then((user) => {
          if (user) {
            resolve(user);
          } else {
            reject(gtConfig.code.error.HTTP_401);
          }
        });
      });
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
    async function socialSignIn(authProviderName) {
      let provider;
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
          throw new Error('Invalid provider.');
      }

      let result;
      try {
        result = await firebase.auth().signInWithPopup(provider);
      } catch (error) {
        result = null;
      }

      if (!result || !result.user || !result.user.providerData) {
        await signOut();
        throw new Error('There was an error. Please try again.');
      }

      const providerData = result.user.providerData[0] || {};

      // Twitter does not provide email...
      // if (!providerData.email) {
      //   return reject('Email must be provided.');
      // }

      if (!providerData.displayName || !providerData.photoURL) {
        await signOut();
        throw new Error('Name and picture must be provided.');
      }

      const data = await User.get(result.user.uid);
      if (data) {
        await User.update(data, {
          email: providerData.email,
          name: providerData.displayName,
          profileImageUrl: providerData.photoURL
        });
      } else {
        await User.set(result.user.uid, {
          authProvider: authProviderName,
          email: providerData.email,
          name: providerData.displayName,
          profileImageUrl: providerData.photoURL
        });
      }
    }

    async function emailRegister(email, name) {
      const emailL = _.toLower(email);
      const password = _getSecurePassword();
      const user = await firebase.auth().createUserWithEmailAndPassword(emailL, password);
      await User.set(user.uid, {
        authProvider: 'password',
        email: user.email || emailL,
        name: user.displayName || name,
        profileImageUrl: user.photoURL || $filter('gtGravatarUrl')(email)
      });
      await signOut();
      await emailSendPasswordReset(emailL);
    }

    function _getSecurePassword() {
      const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?_-';
      const p = [];
      while (p.length < 16) {
        p.push(c[_.random(0, c.length)]);
      }
      return p.join('');
    }

    function emailSendPasswordReset(email) {
      return firebase.auth().sendPasswordResetEmail(email);
    }

    async function emailVerifyPasswordResetCode(code) {
      if (!code || !_.isString(code)) {
        return null;
      }

      try {
        return await firebase.auth().verifyPasswordResetCode(code);
      } catch (error) {
        return null;
      }
    }

    function emailSetPassword(code, password) {
      return firebase.auth().confirmPasswordReset(code, password);
    }

    function emailSignIn(email, password) {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    async function emailUpdatePassword(email, passwordOld, passwordNew) {
      const credential = firebase.auth.EmailAuthProvider.credential(email, passwordOld);
      const user = await requireUser(true);
      await user.reauthenticate(credential)
      await user.updatePassword(passwordNew);
    }

    function signOut() {
      return firebase.auth().signOut();
    }
  }
})();
