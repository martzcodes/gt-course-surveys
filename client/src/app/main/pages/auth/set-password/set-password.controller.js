(function () {
  'use strict';

  angular
    .module('app.pages.auth.forgot-password')
    .controller('SetPasswordController', SetPasswordController);

  /** @ngInject */
  function SetPasswordController(
      $q,
      $state,
      $stateParams,
      $translate,
      $mdToast,

      msUtils,
      Auth,

      user) {
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
      password: ''
    };

    /**
     * Whether the state/URL is invalid.
     *
     * @type {boolean}
     */
    vm.invalid = angular.isUndefined($stateParams.oobCode);

    // Methods

    vm.setPassword = setPassword;

    //////////

    init();

    function init() {
      if (user) {
        $state.go('app.account_profile');
      } else if (vm.invalid) {
        showRequestNewLinkMessage();
      }
    }

    /**
     * Shows a toast with a link to request new reset link.
     *
     * @private
     */
    function showRequestNewLinkMessage() {
      $q.all([
        $translate('SETPASSWORD.INVALID_OR_EXPIRED'),
        $translate('SETPASSWORD.REQUEST_NEW_LINK')
      ])
      .then(function (translations) {
        return $mdToast.show(
          $mdToast.simple()
            .textContent(translations[0])
            .action(translations[1])
            .hideDelay(0)
            .highlightAction(true)
        );
      })
      .then(function () {
        $state.go('app.pages_auth_forgot-password');
      });
    }

    /**
     * Sets the user's password.
     *
     * @param {object} user
     */
    function setPassword(user) {
      vm.working = true;

      Auth.email.setPassword(user.password, $stateParams.oobCode)
      .then(function (email) {
        return Auth.email.signIn(email, user.password);
      })
      .then(function () {
        $state.go('app.account_profile');
      })
      .catch(function () {
        showRequestNewLinkMessage();

        vm.working = false;
        vm.invalid = true;
      });
    }
  }
})();
