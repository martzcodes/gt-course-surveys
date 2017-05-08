(function () {
  'use strict';

  angular
    .module('app.main.account.profile')
    .controller('ProfileController', ProfileController);

  /** @ngInject */
  function ProfileController($rootScope, Util, User, Auth, gtConfig, user) {
    const vm = this;

    // Data

    vm.working = false;
    vm.user = user;
    vm.temp = angular.copy(user);

    // Methods

    vm.updateAbout = updateAbout;
    vm.updatePassword = updatePassword;

    //////////

    init();

    function init() {
      $rootScope.$broadcast(gtConfig.code.event.USER_UPDATED, vm.user);
    }

    async function updateAbout() {
      vm.working = true;

      const updates = {
        name: vm.temp.name || vm.user.name,
        specialization: vm.temp.specialization || vm.user.specialization,
        anonymous: angular.isDefined(vm.temp.anonymous) ? vm.temp.anonymous : vm.user.anonymous
      };

      try {
        vm.user = await User.update(vm.user, updates);

        $rootScope.$broadcast(gtConfig.code.event.USER_UPDATED, vm.user);

        Util.toast('Updated.');
      } catch (error) {
        Util.toast(error);
      }

      vm.working = false;
    }

    async function updatePassword() {
      if (vm.temp.passwordNew !== vm.temp.passwordConfirm) {
        Util.toast('Passwords do not match.');
        return;
      }

      vm.working = true;

      try {
        await Auth.email.updatePassword(vm.user.email, vm.temp.passwordCurrent, vm.temp.passwordNew)

        Util.toast('Updated.');
      } catch (error) {
        Util.toast(error);
      }

      vm.working = false;
    }
  }
})();
