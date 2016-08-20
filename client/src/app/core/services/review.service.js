(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Review', Review);

  /** @ngInject */
  function Review($q, msUtils, Auth, User, Course, Semester, firebase, moment, _) {
    var cache = {};

    var service = {
      getByCourse: getByCourse,
      getByUser: getByUser,
      getRecent: getRecent,
      isRecent: isRecent,
      update: update,
      remove: remove,
      push: push
    };

    return service;

    //////////

    /**
     * Puts a review into the cache.
     *
     * @param {!Review}
     * @return {!Review}
     * @private
     */
    function putInCache(review) {
      _.forEach(_.keys(cache), function (key) {
        var reviews = _.get(cache, [key, review[key]], []);

        if (reviews.length === 0) {
          reviews.push(review);
        } else {
          var index = _.findIndex(reviews, ['id', review.id]);
          if (index >= 0) {
            reviews[index] = _.clone(review);
          }
        }

        _.set(cache, [key, review[key]], reviews);
      });

      return review;
    }

    /**
     * Removes a review from the cache.
     *
     * @param {!Review}
     * @return {!Review}
     * @private
     */
    function removeFromCache(review) {
      _.forEach(_.keys(cache), function (key) {
        var reviews = _.get(cache, [key, review[key]], []);

        if (reviews.length > 0) {
          var index = _.findIndex(reviews, ['id', review.id]);
          if (index >= 0) {
            _.pullAt(reviews, index);
          }
        }

        _.set(cache, [key, review[key]], reviews);
      });

      return review;
    }

    /**
     * Gets reviews for a course.
     *
     * @param {string} courseId
     * @param {boolean=} skipCache
     * @return {!Promise(!Array<Review)}
     */
    function getByCourse(courseId, skipCache) {
      return getByIndex('course', courseId, skipCache);
    }

    /**
     * Gets reviews authored by a user.
     *
     * @param {string} userId
     * @return {!Promise(!Array<Review)}
     */
    function getByUser(userId) {
      return getByIndex('author', userId);
    }

    /**
     * Gets reviews using a regular index lookup.
     *
     * @param {string} key
     * @param {string} value
     * @param {boolean=} skipCache
     * @return {!Promise(!Array<Review)}
     * @private
     */
    function getByIndex(key, value, skipCache) {
      var cached = skipCache ? null : _.get(cache, [key, value]);
      if (cached) {
        return $q.resolve(cached);
      }

      var deferred = $q.defer();

      firebase
        .database()
        .ref('reviews')
        .orderByChild(key)
        .equalTo(value)
        .once('value')
        .then(function (snapshot) {
          return addUserData(msUtils.manyRecordsFromSnapshot(snapshot));
        })
        .then(function (reviews) {
          return addCourseData(reviews);
        })
        .then(function (reviews) {
          return addSemesterData(reviews);
        })
        .then(function (reviews) {
          _.set(cache, [key, value], reviews);

          deferred.resolve(reviews);
        })
        .catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Gets reviews published in the last week.
     *
     * @return {!Promise(!Array<Review>)}
     */
    function getRecent() {
      var deferred = $q.defer();

      firebase
        .database()
        .ref('reviews')
        .orderByChild('created')
        .startAt(recentBeginning().format())
        .once('value')
        .then(function (snapshot) {
          return addUserData(msUtils.manyRecordsFromSnapshot(snapshot));
        })
        .then(function (reviews) {
          return addCourseData(reviews);
        })
        .then(function (reviews) {
          return addSemesterData(reviews);
        })
        .then(deferred.resolve).catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Determines if a review is a recent review that would appear in the quick panel.
     *
     * @param {!Review} review
     * @return {boolean}
     */
    function isRecent(review) {
      return moment.utc(review.created).isSameOrAfter(recentBeginning());
    }

    /**
     * Gets the moment in time after which reviews are considered recent.
     *
     * @return {!Moment}
     */
    function recentBeginning() {
      return moment().subtract(7, 'days').startOf('day').utc();
    }

    /**
     * Adds denormalized user data to a review or list of reviews.
     *
     * @param {!Review|!Array<Review>}
     * @return {!Promise(!Array<Review>)}
     * @private
     */
    function addUserData(reviews) {
      var deferred = $q.defer();

      var isOneReview = !_.isArray(reviews);
      if (isOneReview) {
        reviews = [reviews];
      }

      var currentUser = Auth.getCurrentUserSync();

      var gets = _.chain(reviews).map('author').uniq().map(User.get).value();

      $q.all(gets).then(function (users) {
        var index = _.zipObject(_.map(users, 'id'), users);

        angular.forEach(reviews, function (review) {
          var user = index[review.author];
          if (!user || (user.anonymous && user.id !== _.get(currentUser, 'id'))) {
            review.authorName = 'Anonymous';
            review.authorImageUrl = 'assets/images/avatars/anonymous.png';
          } else {
            review.authorName = user.name;
            review.authorImageUrl = user.profileImageUrl;
          }
        });

        deferred.resolve(isOneReview ? reviews[0] : reviews);
      }).catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Adds denormalized course data to a review or list of reviews.
     *
     * @param {!Review|!Array<Review>}
     * @return {!Promise(!Array<Review>)}
     * @private
     */
    function addCourseData(reviews) {
      var deferred = $q.defer();

      var isOneReview = !_.isArray(reviews);
      if (isOneReview) {
        reviews = [reviews];
      }

      Course.all().then(function (courses) {
        var index = _.zipObject(_.map(courses, 'id'), courses);

        angular.forEach(reviews, function (review) {
          var course = index[review.course];
          if (course) {
            review.courseTitle = course.title;
          }
        });

        deferred.resolve(isOneReview ? reviews[0] : reviews);
      }).catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Adds denormalized semester data to a review or list of reviews.
     *
     * @param {!Review|!Array<Review>}
     * @return {!Promise(!Array<Review>)}
     * @private
     */
    function addSemesterData(reviews) {
      var deferred = $q.defer();

      var isOneReview = !_.isArray(reviews);
      if (isOneReview) {
        reviews = [reviews];
      }

      Semester.all().then(function (semesters) {
        var index = _.zipObject(_.map(semesters, 'id'), semesters);

        angular.forEach(reviews, function (review) {
          var semester = index[review.semester];
          if (semester) {
            review.semesterName = semester.name;
          }
        });

        deferred.resolve(isOneReview ? reviews[0] : reviews);
      }).catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Updates a review.
     *
     * @param {!Review} review Contains updated information.
     * @return {!Promise(!Review)} Resolves with updated review.
     */
    function update(review) {
      var deferred = $q.defer();

      var updates = _.pick(review, [
        'semester',
        'difficulty',
        'workload',
        'rating',
        'text'
      ]);

      updates.updated = moment.utc().format();

      firebase
        .database()
        .ref('reviews')
        .child(review.id)
        .update(updates)
        .then(function () {
          return Semester.get(review.semester);
        })
        .then(function (semester) {
          var updated = _.clone(review);

          updated = _.assign(updated, updates);
          updated = _.assign(updated, { semesterName: semester.name });

          deferred.resolve(putInCache(updated));
        })
        .catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Permanently deletes a review.
     *
     * @param {!Review} review
     * @return {!Promise(!Review)} Resolves with the deleted review.
     */
    function remove(review) {
      var deferred = $q.defer();

      firebase
        .database()
        .ref('reviews')
        .child(review.id)
        .remove()
        .then(function () {
          deferred.resolve(removeFromCache(review));
        })
        .catch(deferred.reject);

      return deferred.promise;
    }

    /**
     * Creates a new review.
     *
     * @param {!Review} review
     * @return {!Promise(!Review)}
     */
    function push(review) {
      var deferred = $q.defer();

      var r = _.chain(review)
        .clone()
        .assign({
          author: Auth.getCurrentUserSync().id,
          created: moment.utc().format()
        })
        .value();

      var ref = firebase.database().ref('reviews').push(r, function (error) {
        if (error) {
          deferred.reject(error);
        } else {
          r.id = ref.key;

          addUserData(r).then(function (r) {
            addCourseData(r).then(function (r) {
              addSemesterData(r).then(function (r) {
                deferred.resolve(putInCache(r));
              }).catch(deferred.reject);
            }).catch(deferred.reject);
          }).catch(deferred.reject);
        }
      });

      return deferred.promise;
    }
  }
})();
