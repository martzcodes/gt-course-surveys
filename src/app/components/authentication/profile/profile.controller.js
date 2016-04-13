(function () {
    'use strict';

    angular
        .module('app.components.authentication')
        .controller('ProfileController', ProfileController);

    /* @ngInject */
    function ProfileController($mdToast, $filter, auth, authService, userService, _) {
        var vm = this;

        vm.working = false;

        vm.user = userService.getByIdSync(auth.uid);

        vm.specializations = [0, 1, 2, 3];

        vm.update = update;

        ////////////////

        function update(what) {
            vm.working = true;

            var promise;
            if (_.eq(what, 'user')) {
                promise = userService.save(vm.user);
            } else {
                promise = authService.$changePassword({
                    email: vm.user.email,
                    oldPassword: vm.password.old,
                    newPassword: vm.password.new
                });
            }

            promise
            .then(function () {
                $mdToast.show(
                    $mdToast.simple()
                    .content($filter('translate')('PROFILE.UPDATED'))
                    .position('bottom right')
                    .hideDelay(3000)
                );
            })
            .catch(function (error) {
                $mdToast.show(
                    $mdToast.simple()
                    .content(error.message)
                    .position('bottom right')
                    .hideDelay(5000)
                );
            })
            .finally(function () {
                vm.working = false;
            });
        }
    }
})();
