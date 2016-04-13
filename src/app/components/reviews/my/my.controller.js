(function () {
    'use strict';

    angular
        .module('app.components.reviews')
        .controller('MyReviewsController', MyReviewsController);

    /* @ngInject */
    function MyReviewsController(reviews) {
        var vm = this;

        vm.reviews = reviews;
    }
})();
