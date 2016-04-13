(function () {
    'use strict';

    angular
        .module('app.components.authentication')
        .controller('SignupController', SignupController);

    /* @ngInject */
    function SignupController($state, $mdToast, $filter, triSettings, auth, authService, _) {
        var vm = this;

        vm.triSettings = triSettings;

        vm.working = false;

        vm.user = {
            email: ''
        };

        vm.generatePassword = generatePassword;
        vm.signupClick = signupClick;

        activate();

        ////////////////

        function activate() {
            if (auth) {
                $state.go('triangular.admin-default.profile');
            }
        }

        function generatePassword() {
            var c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?_-';
            var p = [];
            while (p.length < 16) {
                p.push(c[_.random(0, c.length - 1)]);
            }
            return p.join('');
        }

        function signupClick() {
            vm.working = true;

            authService.$createUser({
                email: vm.user.email,
                password: vm.generatePassword()
            })
            .then(function () {
                return authService.$resetPassword({
                    email: vm.user.email
                });
            })
            .then(function () {
                return $mdToast.show(
                    $mdToast.simple()
                    .content($filter('translate')('SIGNUP.MESSAGES.CONFIRM_SENT'))
                    .position('bottom right')
                    .action($filter('translate')('SIGNUP.MESSAGES.LOGIN_NOW'))
                    .highlightAction(true)
                    .hideDelay(0)
                );
            })
            .then(function () {
                $state.go('authentication.login', {
                    email: vm.user.email
                });
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
