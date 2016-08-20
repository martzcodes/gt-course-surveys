(function () {
  'use strict';

  angular
    .module('app.pages.auth.login')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($state, $stateParams, msUtils, Auth, user) {
    var vm = this;

    // Data

    /**
     * Whether there is an asynchronous operation happening.
     *
     * @type {boolean}
     */
    vm.working = false;

    /**
     * User object for the view.
     *
     * @type {object}
     */
    vm.user = {
      email: $stateParams.e || '',
      password: $stateParams.p  || ''
    };

    /**
     * 3rd party authentication providers.
     *
     * @type {!Array<object>}
     */
    vm.authProviders = [{
      name: 'google',
      icon: 'icon-google-plus'
    },{
      name: 'facebook',
      icon: 'icon-facebook'
    },{
      name: 'twitter',
      icon: 'icon-twitter'
    },{
      name: 'github',
      icon: 'icon-github'
    }];

    // Methods

    vm.loginWithEmail = loginWithEmail;
    vm.loginWithSocial = loginWithSocial;

    //////////

    init();

    function init() {
      if (user) {
        $state.go('app.account_profile');
      } else if (vm.user.email && vm.user.password) {
        vm.login(vm.user);
      }
    }

    /**
     * Signs in a user.
     *
     * @param {object} user
     */
    function loginWithEmail(user) {
      vm.working = true;

      Auth.email.signIn(user.email, user.password)
      .then(function () {
        $state.go('app.account_profile');
      })
      .catch(function (error) {
        msUtils.toast(error);

        vm.working = false;
      });
    }

    /**
     * Signs in a user with a 3rd party authentication provider.
     *
     * @param {string} authProvider
     */
    function loginWithSocial(authProvider) {
      vm.working = true;

      Auth.social.signIn(authProvider.name)
      .then(function () {
        $state.go('app.account_profile');
      })
      .catch(msUtils.toast)
      .finally(function () {
        vm.working = false;
      });
    }
  }
})();
