(function () {
    'use strict';

    angular
        .module('app.components.grades')
        .config(componentConfig);

    /* @ngInject */
    function componentConfig($translatePartialLoaderProvider, $stateProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/components/grades');

        $stateProvider
        .state('triangular.admin-default.grades', {
            abstract: true,
            templateUrl: 'app/components/grades/layouts/grades.tmpl.html'
        })
        .state('triangular.admin-default.grades.all', {
            url: '/grades/all',
            templateUrl: 'app/components/grades/all/all.tmpl.html',
            controller: 'AllGradesController',
            controllerAs: 'vm',
            resolve: {
                grades: requireGrades
            }
        });

        triMenuProvider.addMenu({
            type: 'divider',
            priority: 5.0
        });
        triMenuProvider.addMenu({
            name: 'MENU.GRADES.ALL',
            icon: 'zmdi zmdi-assignment',
            type: 'link',
            state: 'triangular.admin-default.grades.all',
            priority: 5.1
        });
    }

    /* @ngInject */
    function requireGrades(gradeService) {
        return gradeService.getGrades();
    }
})();
