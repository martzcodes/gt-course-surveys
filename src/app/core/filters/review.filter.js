(function () {
    'use strict';

    angular
        .module('app.core.filters')
        .filter('review', review);

    /* @ngInject */
    function review($filter, _) {
        return reviewFilter;

        ////////////////

        function reviewFilter(value, kind) {
            if (_.eq(kind, 'difficulty')) {
                return $filter('translate')('REVIEW.DIFFICULTY.' + value);
            }

            if (_.eq(kind, 'rating')) {
                return $filter('translate')('REVIEW.RATING.' + value);
            }

            if (_.eq(kind, 'workload')) {
                if (value !== 1) {
                    return [
                        value,
                        $filter('translate')('REVIEW.HOURS_PER_WEEK')
                    ].join(' ');
                } else {
                    return [
                        value,
                        $filter('translate')('REVIEW.HOUR_PER_WEEK')
                    ].join(' ');
                }
            }

            return null;
        }
    }
})();
