(function () {
    'use strict';

    angular
        .module('app.core.services')
        .factory('reviewService', reviewService);

    /* @ngInject */
    function reviewService($q, $filter, $firebaseArray, authService, databaseService, moment, _) {
        var service = {
            cache: {
                reviews: null,
                courses: {},
                authors: {}
            },

            getReviews: getReviews,
            getReviewsForCourse: getReviewsForCourse,
            getReviewsForCourseSync: getReviewsForCourseSync,
            getReviewsForAuthor: getReviewsForAuthor,
            getRecentReviews: getRecentReviews,
            getDifficulties: getDifficulties,
            getRatings: getRatings,

            add: add
        };
        return service;

        ////////////////

        function getReviews() {
            var self = this;

            if (!_.isNull(self.cache.reviews)) {
                return self.cache.reviews.$loaded();
            }

            self.cache.reviews = new $firebaseArray(databaseService.child('reviews'));
            return self.cache.reviews.$loaded();
        }

        function getReviewsForCourse(id) {
            var self = this;

            if (_.isEmpty(id)) {
                return $q.reject('COURSE_REQUIRED');
            }

            if (!_.isEmpty(self.cache.courses[id])) {
                return self.cache.courses[id].$loaded();
            }

            var query = databaseService.child('reviews').orderByChild('course').equalTo(id);
            self.cache.courses[id] = new $firebaseArray(query);
            return self.cache.courses[id].$loaded();
        }

        function getReviewsForCourseSync(id) {
            var self = this;

            return self.cache.courses[id] || [];
        }

        function getReviewsForAuthor(id) {
            var self = this;

            if (_.isEmpty(id)) {
                return $q.reject('AUTH_REQUIRED');
            }

            if (!_.isEmpty(self.cache.courses[id])) {
                return self.cache.courses[id].$loaded();
            }

            var query = databaseService.child('reviews').orderByChild('author').equalTo(id);
            self.cache.courses[id] = new $firebaseArray(query);
            return self.cache.courses[id].$loaded();
        }

        function getRecentReviews() {
            var self = this;

            return $q(function (resolve, reject) {
                self.getReviews()
                .then(function (reviews) {
                    var now = moment.utc();
                    return resolve(_.sortBy(_.filter(reviews, function (review) {
                        return now.diff(moment(review.created), 'days') < 14;
                    }), ['created']).reverse());
                })
                .catch(reject);
            });
        }

        function getDifficulties() {
            return _.map([1, 2, 3, 4, 5], function (d) {
                return {
                    value: d,
                    label: $filter('translate')('REVIEW.DIFFICULTY.' + d)
                };
            });
        }

        function getRatings() {
            return _.map([1, 2, 3, 4, 5], function (r) {
                return {
                    value: r,
                    label: $filter('translate')('REVIEW.RATING.' + r)
                };
            });
        }

        function add(review) {
            var self = this;
            var authData = authService.$getAuth();

            if (_.isNull(self.cache.reviews) || _.isEmpty(authData)) {
                return $q.reject({ message: 'Invalid operation.' });
            }

            review.author = authData.uid;
            review.updated = review.created = moment.utc().format();
            return self.cache.reviews.$add(review);
        }
    }
})();
