(function () {
    'use strict';

    angular
        .module('app.core.filters')
        .filter('semester', semester);

    /* @ngInject */
    function semester(semesterService, _) {
        return semesterFilter;

        ////////////////

        function semesterFilter(id, property) {
            var semester = semesterService.getByIdSync(id);

            if (_.isEmpty(semester)) {
                return null;
            }

            return semester[property] || null;
        }
    }
})();
