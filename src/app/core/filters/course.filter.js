(function () {
    'use strict';

    angular
        .module('app.core.filters')
        .filter('course', course);

    /* @ngInject */
    function course(courseService, _) {
        return courseFilter;

        ////////////////

        function courseFilter(id, property) {
            var course = courseService.getByIdSync(id);

            if (_.isEmpty(course)) {
                return null;
            }

            if (_.eq(property, 'title')) {
                return [
                    course.department,
                    course.number,
                    course.name
                ].join(' ');
            }

            if (_.eq(property, 'menuCaption')) {
                return [
                    course.number,
                    course.name
                ].join(' ');
            }

            return course[property] || null;
        }
    }
})();
