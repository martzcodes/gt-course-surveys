(function () {
    'use strict';

    angular
        .module('app.core.services')
        .factory('gradeService', gradeService);

    /* @ngInject */
    function gradeService($q, $firebaseArray, databaseService, courseService, _) {
        var service = {
            grades: null,
            properties: ['a', 'b', 'c', 'd', 'f', 'i', 's', 'u', 'v', 'w', 'total'],

            getGrades: getGrades
        };
        return service;

        ////////////////

        function getGrades() {
            var self = this;

            if (!_.isNull(self.grades)) {
                return $q.resolve(self.grades);
            }

            return $q(function (resolve, reject) {
                var grades = new $firebaseArray(databaseService.child('grades'));

                $q.all({
                    grades: grades.$loaded(),
                    courses: courseService.getCourses()
                })
                .then(function (result) {
                    /*

                    Example grade object:

                        "courseId": {
                            "a": 39,
                            "b": 3,
                            ...,
                            "v": 1,
                            "w": 1,
                            "total": 44
                        }

                     */

                    return resolve(_.map(result.grades, function (courseGrades) {
                        var courseId = courseGrades.$id;

                        // exclude properties that begin with $
                        var pruned = _.pick(courseGrades, self.properties);
                        var total = pruned.total;

                        var counts = _.omit(pruned, 'total');
                        var percentages = _.mapValues(counts, function (n) {
                            return _.ceil(n * 100 / total, 0);
                        });

                        return {
                            'course': courseService.getByIdSync(courseId),
                            '#': counts,
                            '%': percentages,
                            'total': total
                        };
                    }));
                })
                .catch(reject);
            });
        }
    }
})();
