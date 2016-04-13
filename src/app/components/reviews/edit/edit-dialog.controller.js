(function () {
    'use strict';

    angular
        .module('app.components.reviews')
        .controller('EditReviewController', EditReviewController);

    /* @ngInject */
    function EditReviewController($filter, $mdDialog, review, courseService, reviewService, semesterService, _) {
        var vm = this;

        vm.review = review;
        vm.reviewSnapshot = {};

        vm.courses = courseService.getCoursesSync();
        vm.semesters = semesterService.getSemestersSync();
        vm.difficulties = reviewService.getDifficulties();
        vm.ratings = reviewService.getRatings();

        vm.hide = hide;
        vm.cancel = cancel;

        activate();

        ////////////////

        function activate() {
            vm.reviewSnapshot = _.clone(vm.review);
        }

        function hide() {
            _.assign(vm.review, vm.reviewSnapshot);
            $mdDialog.hide(vm.review);
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
})();
