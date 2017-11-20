(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Review', Review);

  /** @ngInject */
  function Review(CacheFactory, Api, Archive, Util, Auth, User, Course, Semester) {
    const ini = 'RVW';
    const cacheKey = 'all-1.0.0';
    const cacheNew = CacheFactory(ini);
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const cacheOld = CacheFactory(`${ini}-old`, {
      maxAge: oneWeek,
      cacheFlushInterval: oneWeek
    });

    const anonymous = {
      authorName: 'Anonymous',
      authorImageUrl: 'assets/images/avatars/anonymous.png'
    };

    const service = {
      bust,
      all,
      getByCourse,
      getByUser,
      getByCurrentUser,
      getRecent,
      isRecent,
      update,
      remove,
      push,
      hash
    };

    return service;

    //////////

    function bust() {
      cacheNew.remove(cacheKey);
      cacheOld.remove(cacheKey);
    }

    async function all(limit = 100) {
      const newReviews = cacheNew.get(cacheKey);
      const oldReviews = cacheOld.get(cacheKey);

      // console.log('newReviews:', newReviews);
      // console.log('oldReviews:', oldReviews);

      if (newReviews && oldReviews) {
        // console.log('CACHE HIT');
        return _.chain(newReviews).concat(oldReviews).sortBy('created').value();
      }

      const promises = [];

      if (newReviews) {
        promises.push(Promise.resolve(newReviews));
      } else {
        // console.log('CACHE MISS: NEW');
        promises.push(
          firebase.database().ref(ini).once('value')
            .then(snapshot => _denormalize(Util.many(snapshot), false))
            .catch(() => [])
        );
      }

      if (oldReviews) {
        promises.push(Promise.resolve(oldReviews));
      } else {
        // console.log('CACHE MISS: OLD');
        promises.push(
          Archive.get(ini)
            .then(archived => _denormalize(Util.manyJson(archived), true))
            .catch(() => [])
        );
      }

      const [
        newReviewsFetched,
        oldReviewsFetched
      ] = await Promise.all(promises);

      // console.log('NEW FETCHED:', newReviewsFetched.length);
      // console.log('OLD FETCHED:', oldReviewsFetched.length);

      if (!newReviews) {
        // console.log('CACHING NEW');
        cacheNew.put(cacheKey, newReviewsFetched);
      }

      if (!oldReviews) {
        // console.log('CACHING OLD');
        cacheOld.put(cacheKey, oldReviewsFetched);
      }

      const allReviews = _.chain(newReviewsFetched)
        .concat(oldReviewsFetched)
        .sortBy('created')
        .value();

      return limit
        ? _.takeRight(allReviews, limit)
        : allReviews;
    }

    function _lastWeek() {
      return moment().subtract(7, 'days').startOf('day').utc();
    }

    function isRecent(review) {
      return moment.utc(review.created).isSameOrAfter(_lastWeek());
    }

    async function _getByIndex(key, value) {
      const list = await all();

      return _.chain(list).filter([key, value]).sortBy(key).value();
    }

    function getByCourse(courseId) {
      return _getByIndex('course', courseId);
    }

    function getByUser(userId) {
      return _getByIndex('author', userId);
    }

    async function getByCurrentUser() {
      const user = await Auth.waitForUser(true);
      if (user) {
        return _getByIndex('author', user._id);
      }
      return [];
    }

    async function getRecent() {
      // const list = await all();

      // return _.chain(list).filter(isRecent).sortBy('created').value();
    }

    async function _denormalize(reviews, archived) {
      const isMany = _.isArray(reviews);
      const toDenormalize = isMany ? reviews : [reviews];

      const withArcData = _addArcData(toDenormalize, archived);
      const withUsrData = await _addUsrData(withArcData);
      const withCrsData = await _addCrsData(withUsrData);
      const withSemData = await _addSemData(withCrsData);

      return isMany ? withSemData : withSemData[0];
    }

    function _addArcData(reviews, archived) {
      return _.map(reviews, (review) => _.assign({}, review, { archived }));
    }

    async function _addUsrData(reviews) {
      const auth = await Auth.waitForUser(true);
      if (!auth) {
        return _.map(reviews, (review) => _.assign({}, review, anonymous));
      }

      const gets = _.chain(reviews).map('author').uniq().map(User.get).value();
      const users = await Promise.all(gets);
      const index = _.zipObject(_.map(users, '_id'), users);

      return _.map(reviews, (review) => {
        const user = index[review.author];
        if (user && !user.anonymous) {
          return _.assign({}, review, {
            authorName: user.name,
            authorImageUrl: user.profileImageUrl
          });
        }
        return _.assign({}, review, anonymous);
      });
    }

    async function _addCrsData(reviews) {
      const courses = await Course.all();
      const index = _.zipObject(_.map(courses, '_id'), courses);

      return _.map(reviews, (review) => {
        const course = index[review.course];
        if (course) {
          return _.assign({}, review, { courseTitle: course.title });
        }
        return review;
      });
    }

    async function _addSemData(reviews) {
      const semesters = await Semester.all(true);
      const index = _.zipObject(_.map(semesters, '_id'), semesters);

      return _.map(reviews, (review) => {
        const semester = index[review.semester];
        if (semester) {
          return _.assign({}, review, { semesterName: semester.name });
        }
        return review;
      });
    }

    async function update(review) {
      const updates = _.pick(review, [
        'semester',
        'difficulty',
        'workload',
        'rating',
        'text'
      ]);

      updates.updated = moment.utc().format();

      if (review.archived) {
        await Api.post('ARCHIVED-REVIEW-UPDATE', review);
      } else {
        await firebase.database().ref(ini).child(review._id).update(updates);
      }

      const denormalized = await _denormalize(_.assign({}, review, updates), review.archived);

      const cache = review.archived ? cacheOld : cacheNew;
      const list = cache.get(cacheKey);
      if (list) {
        const index = _.findIndex(list, ['_id', review._id]);
        if (index >= 0) {
          list[index] = denormalized;
          cache.put(cacheKey, list);
        }
      }

      return denormalized;
    }

    async function remove(review) {
      if (review.archived) {
        await Api.post('ARCHIVED-REVIEW-REMOVE', review._id);
      } else {
        await firebase.database().ref(ini).child(review._id).remove();
      }

      const cache = review.archived ? cacheOld : cacheNew;
      const list = cache.get(cacheKey);
      if (list) {
        _.remove(list, ['_id', review._id]);
        cache.put(cacheKey, list);
      }

      return review;
    }

    async function push(review) {
      const user = await Auth.requireUser(true);

      return new Promise((resolve, reject) => {
        const toPush = _.assign({}, review, {
          author: user._id,
          created: moment.utc().format()
        });

        const ref = firebase.database().ref(ini).push(toPush, async(error) => {
          if (error) {
            reject(error);
          } else {
            const pushed = _.assign({}, toPush, { _id: ref.key });
            try {
              const denormalized = await _denormalize(pushed, false);

              const list = cacheNew.get(cacheKey);
              if (list) {
                list.push(denormalized);
                cacheNew.put(cacheKey, list);
              }

              resolve(denormalized);
            } catch (error) {
              reject(error);
            }
          }
        });
      });
    }

    //
    // DEPRECATED
    //
    function hash(reviews) {
      return _.chain(reviews)
        .map((r) => [r._id, r.difficulty, r.workload, r.rating])
        .flatten()
        // eslint-disable-next-line no-bitwise
        .reduce((hashCode, x) => hashCode ^ Util.hashCode(_.toString(x)))
        .value() || 0;
    }
  }
})();
