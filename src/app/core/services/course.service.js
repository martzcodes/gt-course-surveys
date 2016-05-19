(function () {
    'use strict';

    angular
        .module('app.core.services')
        .factory('courseService', courseService);

    /* @ngInject */
    function courseService($q, $firebaseArray, databaseService, reviewService, _) {
        var service = {
            courses: null,

            getCourse: getCourse,
            getCourses: getCourses,
            getCoursesSync: getCoursesSync,
            getByIdSync: getByIdSync
        };
        return service;

        ////////////////

        function getCourse(id, skipCache) {
            var self = this;

            if (_.isEmpty(id)) {
                return $q.reject('COURSE_REQUIRED');
            }

            return $q(function (resolve, reject) {
                self.getCourses(skipCache)
                .then(function () {
                    return resolve(_.find(self.courses, ['$id', id]) || null);
                })
                .catch(reject);
            });
        }

        function getCourses(skipCache) {
            var self = this;

            if (!_.isNull(self.courses) && !skipCache) {
                return $q.resolve(self.courses);
            }

            return $q(function (resolve, reject) {
                var courses = new $firebaseArray(databaseService.child('courses'));

                courses.$loaded()
                .then(function (courses) {
                    return $q.all(requestReviews(courses));
                })
                .then(function (reviews) {
                    processCourses(courses, reviews);
                    return resolve(self.courses = courses);
                })
                .catch(reject);
            });
        }

        function getCoursesSync() {
            var self = this;

            return self.courses;
        }

        function getByIdSync(id) {
            var self = this;

            return self.courses ? self.courses.$getRecord(id) : null;
        }

        function requestReviews(courses) {
            var reviews = {};

            angular.forEach(courses, function (course) {
                reviews[course.$id] = reviewService.getReviewsForCourse(course.$id);
            });

            return reviews;
        }

        function processCourses(courses, reviews) {
            angular.forEach(courses, function (course) {
                // link the reviews
                course.reviews = reviews[course.$id];
                course.reviewCount = course.reviews.length;

                // calculate averages
                course.averageDifficulty = 0;
                course.averageWorkload = 0;

                var totals = { difficulty: 0, workload: 0 };
                var counts = { difficulty: 0, workload: 0 };

                angular.forEach(course.reviews, function (review) {
                    if (review.difficulty > 0) {
                        totals.difficulty += review.difficulty;
                        counts.difficulty++;
                    }
                    if (review.workload > 0) {
                        totals.workload += review.workload;
                        counts.workload++;
                    }
                });

                if (counts.difficulty > 0) {
                    course.averageDifficulty = _.ceil(totals.difficulty / counts.difficulty, 1);
                }
                if (counts.workload > 0) {
                    course.averageWorkload = _.ceil(totals.workload / counts.workload, 1);
                }

                // append section number to course number (if available)
                if (!_.isEmpty(course.section)) {
                    course.number += '-' + course.section;
                }
            });
        }
    }
})();
