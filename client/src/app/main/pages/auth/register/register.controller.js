(function () {
  'use strict';

  angular
    .module('app.pages.auth.register')
    .controller('RegisterController', RegisterController);

  /** @ngInject */
  function RegisterController($filter, $state, msUtils, Auth, user) {
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
      name: '',
      email: ''
    };

    // Methods

    vm.register = register;

    //////////

    init();

    function init() {
      if (user) {
        $state.go('app.account_profile');
      }
    }

    /**
     * Registers a user to WODLeader.
     *
     * @param {object} user
     */
    function register(user) {
      vm.working = true;

      Auth.email.register(user.email, user.name)
      .then(function () {
        msUtils.toast($filter('translate')('REGISTER.CREATED'));
      })
      .catch(function (error) {
        msUtils.toast(error);
      })
      .finally(function () {
        vm.working = false;
      });
    }
  }
})();
