(function () {
    'use strict';

    angular
        .module('app.components.help')
        .config(componentConfig);

    /* @ngInject */
    function componentConfig($translatePartialLoaderProvider, $stateProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/components/help');

        $stateProvider
        .state('triangular.admin-default.help', {
            url: '/help',
            templateUrl: 'app/components/help/help.tmpl.html',
            controller: 'HelpController',
            controllerAs: 'vm'
        });

        triMenuProvider.addMenu({
            name: 'MENU.HELP',
            icon: 'fa fa-question',
            type: 'link',
            state: 'triangular.admin-default.help',
            priority: 6.0
        });
    }
})();
