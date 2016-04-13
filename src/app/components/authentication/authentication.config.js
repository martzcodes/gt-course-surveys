(function () {
    'use strict';

    angular
        .module('app.components.authentication')
        .config(componentConfig);

    /* @ngInject */
    function componentConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/components/authentication');

        $stateProvider
        .state('authentication', {
            abstract: true,
            templateUrl: 'app/components/authentication/layouts/authentication.tmpl.html'
        })
        .state('authentication.login', {
            url: '/login?email',
            templateUrl: 'app/components/authentication/login/login.tmpl.html',
            controller: 'LoginController',
            controllerAs: 'vm',
            resolve: {
                auth: waitForAuth
            }
        })
        .state('authentication.signup', {
            url: '/signup',
            templateUrl: 'app/components/authentication/signup/signup.tmpl.html',
            controller: 'SignupController',
            controllerAs: 'vm',
            resolve: {
                auth: waitForAuth
            }
        })
        .state('authentication.forgot', {
            url: '/forgot',
            templateUrl: 'app/components/authentication/forgot/forgot.tmpl.html',
            controller: 'ForgotController',
            controllerAs: 'vm',
            resolve: {
                auth: waitForAuth
            }
        })
        .state('triangular.admin-default.profile', {
            url: '/profile',
            templateUrl: 'app/components/authentication/profile/profile.tmpl.html',
            controller: 'ProfileController',
            controllerAs: 'vm',
            resolve: {
                auth: requireAuth,
                users: requireUsers
            }
        });
    }

    /* @ngInject */
    function waitForAuth(authService) {
        return authService.$waitForAuth();
    }

    /* @ngInject */
    function requireAuth(authService) {
        return authService.$requireAuth();
    }

    /* @ngInject */
    function requireUsers(userService) {
        return userService.getUsers();
    }
})();
