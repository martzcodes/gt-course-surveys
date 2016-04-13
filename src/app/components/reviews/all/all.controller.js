(function () {
    'use strict';

    angular
        .module('app.components.reviews')
        .controller('AllReviewsController', AllReviewsController);

    /* @ngInject */
    function AllReviewsController($state, courses) {
        var vm = this;

        vm.courses = courses;

        vm.sortType = null;
        vm.sortReverse = null;

        vm.toggleSort = toggleSort;
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

        function goTo(course) {
            $state.go('triangular.admin-default.reviews-course', {
                id: course.$id
            });
        }
    }
})();
