(function () {
    'use strict';

    angular
        .module('app.components.authentication')
        .controller('ForgotController', ForgotController);

    /* @ngInject */
    function ForgotController($state, $mdToast, $filter, triSettings, auth, authService) {
        var vm = this;

        vm.triSettings = triSettings;

        vm.working = false;

        vm.user = {
            email: ''
        };

        vm.resetClick = resetClick;

        activate();

        ////////////////

        function activate() {
            if (auth) {
                $state.go('triangular.admin-default.profile');
            }
        }

        function resetClick() {
            vm.working = true;

            authService.$resetPassword({
                email: vm.user.email
            })
            .then(function () {
                return $mdToast.show(
                    $mdToast.simple()
                    .content($filter('translate')('FORGOT.MESSAGES.RESET_SENT'))
                    .position('bottom right')
                    .action($filter('translate')('FORGOT.MESSAGES.LOGIN_NOW'))
                    .highlightAction(true)
                    .hideDelay(0)
                );
            })
            .then(function () {
                $state.go('authentication.login');
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
