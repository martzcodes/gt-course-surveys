(function () {
    'use strict';

    angular
        .module('app.components.authentication')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController($state, $stateParams, $mdToast, $filter, triSettings, auth, authService, userService) {
        var vm = this;

        vm.triSettings = triSettings;

        vm.working = false;

        vm.user = {
            email: $stateParams.email || '',
            password: '',
            rememberMe: false
        };

        vm.socialLogins = [{
            icon: 'fa fa-google-plus',
            color: '#e05d6f',
            provider: 'google'
        }, {
            icon: 'fa fa-facebook',
            color: '#337ab7',
            provider: 'facebook'
        }, {
            icon: 'fa fa-twitter',
            color: '#5bc0de',
            provider: 'twitter'
        }, {
            icon: 'fa fa-github',
            color: '#cccccc',
            provider: 'github'
        }];

        vm.loginClick = loginClick;

        activate();

        ////////////////

        function activate() {
            if (auth) {
                $state.go('triangular.admin-default.profile');
            }
        }

        function loginClick(provider, redirect) {
            vm.working = true;

            var promise;
            if (provider === 'password') {
                promise = authService.$authWithPassword(vm.user, {
                    remember: vm.user.rememberMe ? 'default' : 'sessionOnly'
                });
            } else if (redirect) {
                promise = authService.$authWithOAuthRedirect(provider, {
                    scope: 'email'
                });
            } else {
                promise = authService.$authWithOAuthPopup(provider, {
                    scope: 'email'
                });
            }

            promise
            .then(function (authData) {
                return userService.create(authData);
            })
            .then(function () {
                return $state.go('triangular.admin-default.profile');
            })
            .then(function () {
                $mdToast.show(
                    $mdToast.simple()
                    .content($filter('translate')('LOGIN.MESSAGES.LOGGED_IN'))
                    .position('bottom right')
                    .hideDelay(3000)
                );
            })
            .catch(function (error) {
                if (error.code === 'TRANSPORT_UNAVAILABLE') {
                    vm.loginClick(provider, true);
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                        .content(error.message)
                        .position('bottom right')
                        .hideDelay(5000)
                    );
                }
            })
            .finally(function () {
                vm.working = false;
            });
        }
    }
})();
