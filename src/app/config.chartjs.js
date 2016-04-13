(function () {
    'use strict';

    angular
        .module('app')
        .config(chartConfig);

    /* @ngInject */
    function chartConfig(ChartJsProvider) {
        ChartJsProvider.setOptions({
            colours: [
                '#4285F4', // blue
                '#DB4437', // red
                '#F4B400', // yellow
                '#0F9D58', // green
                '#AB47BC', // purple
                '#00ACC1', // light blue
                '#FF7043', // orange
                '#9E9D24', // browny yellow
                '#5C6BC0'  // dark blue
            ],
            responsive: true
        });
    }
})();
