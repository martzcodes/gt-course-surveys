(function () {
  'use strict';

  angular
    .module('app.main.pages.auth.forgot-password')
    .controller('ForgotPasswordController', ForgotPasswordController);

  /** @ngInject */
  function ForgotPasswordController($state, $stateParams, Util, Auth, user) {
    const vm = this;

    // Data

    vm.working = false;

    vm.user = {
      email: $stateParams.e || ''
    };

    // Methods

    vm.sendResetLink = sendResetLink;

    //////////

    init();

    function init() {
      if (user) {
        $state.go('app.main_account_profile');
      }
    }

    async function sendResetLink(email) {
      vm.working = true;
      try {
        await Auth.email.resetPassword(email);
        Util.toast('An email containing the password reset link has been sent.');
      } catch (error){
        Util.toast(error);
      }
      vm.working = false;
    }
  }
})();
