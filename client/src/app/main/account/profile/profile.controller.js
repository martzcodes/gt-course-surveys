(function () {
  'use strict';

  angular
    .module('app.account.profile')
    .controller('ProfileController', ProfileController);

  /** @ngInject */
  function ProfileController(
      $rootScope,
      $filter,
      msUtils,
      User,
      Auth,
      eventCode,
      user) {
    var vm = this;
    var translate = $filter('translate');

    // Data

    /**
     * Whether there is an asynchronous operation happening.
     *
     * @type {boolean}
     */
    vm.working = false;

    /**
     * Current user.
     *
     * @type {!User}
     */
    vm.user = user;

    /**
     * Copy of the current user for DOM binding.
     *
     * @type {!User}
     */
    vm.temp = angular.copy(user);

    // Methods

    vm.updateAbout = updateAbout;
    vm.updatePassword = updatePassword;

    //////////

    init();

    function init() {
      $rootScope.$broadcast(eventCode.USER_UPDATED, vm.user);
    }

    /**
     * Updates the user's about section.
     */
    function updateAbout() {
      vm.working = true;

      var updates = {
        name: vm.temp.name || user.name,
        specialization: vm.temp.specialization || user.specialization,
        anonymous: !!vm.temp.anonymous
      };

      User.update(vm.user, updates)
      .then(function (user) {
        vm.user = user;

        $rootScope.$broadcast(eventCode.USER_UPDATED, user);

        msUtils.toast(translate('CORE.UPDATED'));
      })
      .catch(msUtils.toast)
      .finally(function () {
        vm.working = false;
      });
    }

    /**
     * Updates the user's password.
     */
    function updatePassword() {
      if (vm.temp.passwordNew !== vm.temp.passwordConfirm) {
        return msUtils.toast(translate('PROFILE.PASSWORD_NO_MATCH'));
      }

      vm.working = true;

      Auth.email.updatePassword(vm.user.email, vm.temp.passwordCurrent, vm.temp.passwordNew)
      .then(function () {
        msUtils.toast(translate('CORE.UPDATED'));
      })
      .catch(msUtils.toast)
      .finally(function () {
        vm.working = false;
      });
    }
  }
})();
