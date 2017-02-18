(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('Review', Review);

  /** @ngInject */
  function Review(Util, Auth, User, Course, Semester) {
    const ini = 'RVW';
    const anonymous = {
      authorName: 'Anonymous',
      authorImageUrl: 'assets/images/avatars/anonymous.png'
    };

    const service = {
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

    function _lastWeek() {
      return moment().subtract(7, 'days').startOf('day').utc();
    }

    function isRecent(review) {
      return moment.utc(review.created).isSameOrAfter(_lastWeek());
    }

    async function _getByIndex(key, value) {
      const snapshot = await firebase.database().ref(ini)
        .orderByChild(key)
        .equalTo(value)
        .once('value');

      return _denormalize(Util.many(snapshot));
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
      const snapshot = await firebase.database().ref(ini)
        .orderByChild('created')
        .startAt(_lastWeek().format())
        .once('value');

      return _denormalize(Util.many(snapshot));
    }

    async function _denormalize(reviews) {
      const isMany = _.isArray(reviews);
      const toDenormalize = isMany ? reviews : [reviews];

      const withUsrData = await _addUsrData(toDenormalize);
      const withCrsData = await _addCrsData(withUsrData);
      const withSemData = await _addSemData(withCrsData);

      return isMany ? withSemData : withSemData[0];
    }

    async function _addUsrData(reviews) {
      const currentUser = await Auth.waitForUser(true);
      if (!currentUser) {
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
      const semesters = await Semester.all();
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

      await firebase.database().ref(ini).child(review._id).update(updates);

      return _denormalize(_.assign({}, review, updates));
    }

    async function remove(review) {
      await firebase.database().ref(ini).child(review._id).remove();

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
              resolve(await _denormalize(pushed));
            } catch (error) {
              reject(error);
            }
          }
        });
      });
    }

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
