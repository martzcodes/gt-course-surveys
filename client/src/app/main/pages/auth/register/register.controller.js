(function () {
  'use strict';

  angular
    .module('app.main.pages.auth.register')
    .controller('RegisterController', RegisterController);

  /** @ngInject */
  function RegisterController($state, Util, Auth, user) {
    const vm = this;

    // Data

    vm.working = false;

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
        $state.go('app.main_account_profile');
      }
    }

    async function register(user) {
      vm.working = true;
      try {
        await Auth.email.register(user.email, user.name);
        Util.toast('Account created. Please check your email for login instructions.');
      } catch (error) {
        Util.toast(error);
      }
      vm.working = false;
    }
  }
})();
