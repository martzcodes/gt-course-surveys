(function () {
    'use strict';

    angular
        .module('app.core.services')
        .factory('semesterService', semesterService);

    /* @ngInject */
    function semesterService($q, $filter, $firebaseArray, databaseService, unknownSemesterId, _) {
        var service = {
            semesters: null,
            semesterNames: {
                '1': 'Spring',
                '2': 'Summer',
                '3': 'Fall'
            },

            getSemesters: getSemesters,
            getSemestersSync: getSemestersSync,
            getByIdSync: getByIdSync
        };
        return service;

        ////////////////

        function getSemesters() {
            var self = this;

            return $q(function (resolve, reject) {
                if (_.isNull(self.semesters)) {
                    var semesters = new $firebaseArray(databaseService.child('semesters'));
                    semesters.$loaded()
                    .then(function (semesters) {
                        angular.forEach(semesters, function (semester) {
                            if (!_.eq(semester.$id, unknownSemesterId)) {
                                semester.name = [
                                    self.semesterNames[semester.season] || '',
                                    semester.year > 0 ? semester.year : ''
                                ].join(' ');
                            }
                        });
                        return resolve(self.semesters = semesters);
                    })
                    .catch(reject);
                } else {
                    return resolve(self.semesters);
                }
            });
        }

        function getSemestersSync() {
            var self = this;

            return self.semesters;
        }

        function getByIdSync(id) {
            var self = this;

            return self.semesters ? self.semesters.$getRecord(id) : null;
        }
    }
})();
