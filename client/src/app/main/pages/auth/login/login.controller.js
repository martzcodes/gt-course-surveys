(function () {
  'use strict';

  angular
    .module('app.main.pages.auth.login')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($state, $stateParams, Util, Auth, user) {
    const vm = this;

    // Data

    vm.working = false;

    vm.user = {
      email: $stateParams.e || '',
      password: $stateParams.p || ''
    };

    vm.authProviders = [{
      name: 'google',
      icon: 'icon-google-plus'
    }, {
      name: 'facebook',
      icon: 'icon-facebook'
    }, {
      name: 'twitter',
      icon: 'icon-twitter'
    }, {
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
        $state.go('app.main_account_profile');
      } else if (vm.user.email && vm.user.password) {
        vm.loginWithEmail(vm.user);
      }
    }

    async function loginWithEmail(user) {
      vm.working = true;
      try {
        await Auth.email.signIn(user.email, user.password);
        $state.go('app.main_account_profile');
      } catch (error) {
        Util.toast(error);
        vm.working = false;
      }
    }

    async function loginWithSocial(authProvider) {
      vm.working = true;
      try {
        await Auth.social.signIn(authProvider.name);
        $state.go('app.main_account_profile');
      } catch (error) {
        Util.toast(error);
        vm.working = false;
      }
    }
  }
})();
