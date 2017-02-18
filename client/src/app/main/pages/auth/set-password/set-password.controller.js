(function () {
  'use strict';

  angular
    .module('app.main.pages.auth.set-password')
    .controller('SetPasswordController', SetPasswordController);

  /** @ngInject */
  function SetPasswordController($state, $stateParams, $mdToast, Util, Auth, user, email) {
    const vm = this;

    // Data

    vm.working = false;

    vm.user = {
      password: '',
      email: email || null
    };

    // Methods

    vm.setPassword = setPassword;

    //////////

    init();

    function init() {
      if (user) {
        $state.go('app.main_account_profile');
      } else if (!vm.user.email) {
        _toastInvalid();
      }
    }

    async function _toastInvalid() {
      try {
        const toast = $mdToast.simple()
          .textContent('This link is invalid or expired.')
          .action('Request New Link')
          .hideDelay(0)
          .highlightAction(true);
        await $mdToast.show(toast);
        $state.go('app.main_pages_auth_forgot-password');
      } catch (error) {
        // Silent death.
      }
    }

    async function setPassword(user) {
      vm.working = true;
      try {
        await Auth.email.setPassword($stateParams.oobCode, user.password)
        await Auth.email.signIn(user.email, user.password);
        $state.go('app.main_account_profile');
      } catch (error) {
        _toastInvalid();
        vm.working = false;
      }
    }
  }
})();
