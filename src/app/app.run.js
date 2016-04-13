(function () {
    'use strict';

    angular
        .module('app')
        .run(runFunction);

    /* @ngInject */
    function runFunction($rootScope, $q, $location, reviewService, courseService, semesterService, gradeService, triMenu) {
        var body = angular.element('body');

        triMenu.addMenu({
            type: 'divider',
            priority: 0.0
        });

        function hideElement(element) { element.addClass('hide'); }
        function showElement(element) { element.removeClass('hide'); }

        // show progress while loading data on a non-authentication view
        var progress = angular.element('.index-load');

        if (0 > ['/login', '/forgot', '/signup'].indexOf($location.url())) {
            showElement(progress);
        }

        $q.all([
            reviewService.getReviews(),
            courseService.getCourses(),
            semesterService.getSemesters(),
            gradeService.getGrades()
        ])
        .finally(function () {
            body.removeClass('overflow-hidden');
            hideElement(progress);
        });

        // show peak connections message if reached
        var peakMessage = angular.element('.index-peak');

        var oldWarn = console.warn;

        function newWarn(message) {
            oldWarn.apply(console, arguments);
            if (message && message.indexOf &&
                message.indexOf('Peak Connections') >= 0) {
                hideElement(progress);
                showElement(peakMessage);
                body.addClass('overflow-hidden');
            }
        }

        console.warn = newWarn;
    }
})();
