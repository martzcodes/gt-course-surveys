(function () {
    'use strict';

    angular
        .module('app.core.filters')
        .filter('specialization', specialization);

    /* @ngInject */
    function specialization() {
        var map = {
            '0': 'Computational Perception & Robotics',
            '1': 'Computing Systems',
            '2': 'Interactive Intelligence',
            '3': 'Machine Learning'
        };
        return specializationFilter;

        ////////////////

        function specializationFilter(id) {
            return map[id] || '...';
        }
    }
})();
