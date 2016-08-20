(function () {
  'use strict';

  angular
    .module('app.pages.auth.forgot-password')
    .controller('ForgotPasswordController', ForgotPasswordController);

  /** @ngInject */
  function ForgotPasswordController($filter, $state, $stateParams, msUtils, Auth, user) {
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
      email: $stateParams.e || ''
    };

    // Methods

    vm.sendResetLink = sendResetLink;

    //////////

    init();

    function init() {
      if (user) {
        $state.go('app.account_profile');
      }
    }

    /**
     * Sends an email with a password reset link to a user.
     *
     * @param {string} email
     */
    function sendResetLink(email) {
      vm.working = true;

      Auth.email.resetPassword(email)
      .then(function () {
        msUtils.toast($filter('translate')('FORGOTPASSWORD.EMAIL_SENT'));
      })
      .catch(msUtils.toast)
      .finally(function () {
        vm.working = false;
      });
    }
  }
})();
