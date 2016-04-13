(function () {
    'use strict';

    angular
        .module('app.components.reviews')
        .controller('AllGradesController', AllGradesController);

    /* @ngInject */
    function AllGradesController($state, grades) {
        var vm = this;

        vm.grades = grades;
        vm.displayMode = '%';
        vm.sortType = null;
        vm.sortReverse = null;

        vm.toggleSort = toggleSort;
        vm.getSortKey = getSortKey;
        vm.goTo = goTo;

        ////////////////

        function toggleSort(sortType) {
            if (vm.sortReverse === null) {
                vm.sortReverse = true;
            } else if (vm.sortType === sortType) {
                vm.sortReverse = !vm.sortReverse;
            }
            vm.sortType = sortType;
        }

        function getSortKey(courseGrades) {
            switch (vm.sortType) {
                case 'a':
                case 'b':
                case 'c':
                case 'w':
                    return courseGrades[vm.displayMode][vm.sortType];
                case 'd':
                    return courseGrades.course.department;
                case '#':
                    return courseGrades.course.number;
                case 'n':
                    return courseGrades.course.name;
                default:
                    return 0;
            }
        }

        function goTo(course) {
            $state.go('triangular.admin-default.reviews-course', {
                id: course.$id
            });
        }
    }
})();
