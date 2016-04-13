(function () {
    'use strict';

    angular
        .module('app')
        .config(routeConfig);

    /* @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('404', {
                url: '/404',
                templateUrl: '404.tmpl.html',
                controllerAs: 'vm',
                controller: errorPageController
            })
            .state('500', {
                url: '/500',
                templateUrl: '500.tmpl.html',
                controllerAs: 'vm',
                controller: errorPageController
            });

        // set default routes when no path specified
        $urlRouterProvider.when('', '/reviews/all');
        $urlRouterProvider.when('/', '/reviews/all');

        // always goto 404 if route not found
        $urlRouterProvider.otherwise('/404');
    }

    /* @ngInject */
    function errorPageController($state) {
        var vm = this;

        vm.goHome = goHome;

        ////////////////

        function goHome() {
            $state.go('triangular.admin-default.reviews.all');
        }
    }
})();
