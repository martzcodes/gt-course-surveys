(function () {
    'use strict';

    angular
        .module('app.components.reviews')
        .controller('ComposeReviewController', ComposeReviewController);

    /* @ngInject */
    function ComposeReviewController($filter, $stateParams, $mdDialog, $mdToast, slackService, reviewService, auth, reviews) {
        var vm = this;

        vm.auth = auth;
        vm.reviews = reviews;

        vm.composeReview = composeReview;

        ////////////////

        function composeReview($event) {
            $mdDialog.show({
                templateUrl: 'app/components/reviews/edit/edit-dialog.tmpl.html',
                controller: 'EditReviewController',
                controllerAs: 'vm',
                targetEvent: $event,
                locals: {
                    review: {
                        course: $stateParams.id
                    }
                }
            })
            .then(function (review) {
                slackService.postNotification('publish: ' + review.course);
                return reviewService.add(review);
            })
            .then(function () {
                $mdToast.show(
                    $mdToast.simple()
                    .content($filter('translate')('MESSAGES.PUBLISHED'))
                    .position('bottom right')
                    .hideDelay(3000)
                );
            })
            .catch(function (error) {
                if (error && error.message) {
                    $mdToast.show(
                        $mdToast.simple()
                        .content(error.message)
                        .position('bottom right')
                        .hideDelay(5000)
                    );
                }
            });
        }
    }
})();
