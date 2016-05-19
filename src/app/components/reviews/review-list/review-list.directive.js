(function () {
    'use strict';

    angular
        .module('app.components.reviews')
        .directive('reviewList', reviewList);

    /* @ngInject */
    function reviewList() {
        var directive = {
            bindToController: true,
            controller: reviewController,
            controllerAs: 'vm',
            // link: link,
            restrict: 'E',
            scope: {
                model: '=',
                hideCourseTitle: '@'
            },
            templateUrl: 'app/components/reviews/review-list/review-list.tmpl.html'
        };
        return directive;

        // function link($scope, $element, $attributes) {

        // }
    }

    /* @ngInject */
    function reviewController($filter, $mdDialog, $mdToast, authService, slackService, moment, importInstant) {
        var vm = this;

        vm.authData = authService.$getAuth();
        vm.hideCourseTitle = !!vm.hideCourseTitle;

        vm.showReviewInstant = showReviewInstant;

        vm.searchFiltersExpanded = false;

        vm.edit = edit;
        vm.remove = remove;

        function showReviewInstant(review) {
            if (review.updated && review.updated === importInstant) {
                return false;
            } else if (review.created && review.created === importInstant) {
                return false;
            } else {
                return true;
            }
        }

        function edit($event, review) {
            $mdDialog.show({
                templateUrl: 'app/components/reviews/edit/edit-dialog.tmpl.html',
                controller: 'EditReviewController',
                controllerAs: 'vm',
                targetEvent: $event,
                locals: {
                    review: review
                }
            })
            .then(function (review) {
                review.updated = moment.utc().format();
                return vm.model.$save(review);
            })
            .then(function () {
                $mdToast.show(
                    $mdToast.simple()
                    .content($filter('translate')('MESSAGES.UPDATED'))
                    .position('bottom right')
                    .hideDelay(3000)
                );
            })
            .catch(commitIssue);
        }

        function remove($event, review) {
            $mdDialog.show(
                $mdDialog.confirm()
                .title($filter('translate')('REVIEW.DIALOG.REMOVE.TITLE'))
                .textContent($filter('translate')('REVIEW.DIALOG.REMOVE.TEXT'))
                .ok($filter('translate')('GENERAL.OK'))
                .cancel($filter('translate')('GENERAL.CANCEL'))
                .targetEvent($event)
            )
            .then(function () {
                slackService.postNotification('removal: ' + review.course);
                return vm.model.$remove(review);
            })
            .then(function () {
                $mdToast.show(
                    $mdToast.simple()
                    .content($filter('translate')('MESSAGES.REMOVED'))
                    .position('bottom right')
                    .hideDelay(3000)
                );
            })
            .catch(commitIssue);
        }

        function commitIssue(error) {
            if (error && error.message) {
                $mdToast.show(
                    $mdToast.simple()
                    .content(error.message)
                    .position('bottom right')
                    .hideDelay(5000)
                );
            }
        }
    }
})();
