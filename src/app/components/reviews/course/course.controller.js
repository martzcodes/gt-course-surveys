(function () {
    'use strict';

    angular
        .module('app.components.reviews')
        .controller('CourseReviewsController', CourseReviewsController);

    /* @ngInject */
    function CourseReviewsController($state, $stateParams, $scope, reviews, courseService, databaseService) {
        var vm = this;

        vm.reviews = reviews;

        vm.course = null;
        vm.skipCache = null;

        vm.updateCourse = updateCourse;

        activate();

        ////////////////

        function activate() {
            var ref = databaseService
                .child('reviews')
                .orderByChild('course')
                .equalTo($stateParams.id);

            ref.on('value', vm.updateCourse);

            $scope.$on('$destroy', function () {
                ref.off('value', vm.updateCourse);
            });
        }

        function updateCourse() {
            // skip the cache the first time to ensure proper loading in case
            // the user navigates directly to a course reviews page
            vm.skipCache = vm.skipCache === null ? false : true;

            courseService.getCourse($stateParams.id, vm.skipCache)
            .then(function (course) {
                vm.course = course;

                // reload to apply changes to UI
                if (vm.skipCache) {
                    $state.reload();
                }
            });
        }
    }
})();
