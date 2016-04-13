(function () {
    'use strict';

    angular
        .module('app.components.authentication')
        .run(runFunction);

    /* @ngInject */
    function runFunction($rootScope, $state, $log, triMenu, authService) {
        var destroyers = [];

        destroyers.push($rootScope.$on('$stateChangeError', function ($event, $toState, $toParams, $fromState, $fromParams, $error) {
            if ($error === 'AUTH_REQUIRED') {
                $state.go('authentication.login');
            } else {
                $state.go('triangular.admin-default.reviews.all');
                $log.error('$stateChangeError');
                $log.log($event);
                $log.log($toState);
                $log.log($toParams);
                $log.log($fromState);
                $log.log($fromParams);
                $log.log($error);
            }
        }));

        destroyers.push(authService.$onAuth(function (authData) {
            if (authData) {
                triMenu.addMenu({
                    name: 'MENU.PROFILE',
                    icon: 'zmdi zmdi-account',
                    type: 'link',
                    state: 'triangular.admin-default.profile',
                    priority: 1.0
                });
                triMenu.addMenu({
                    type: 'divider',
                    state: 'authentication-divider',
                    priority: 2.1
                });
            } else {
                triMenu.removeMenu('authentication-divider');
                triMenu.removeMenu('triangular.admin-default.profile');
            }
        }));

        $rootScope.$on('$destroy', function () {
            angular.forEach(destroyers, function (d) {
                d();
            });
        });
    }
})();
