'use strict';

describe('service: Review', function () {
  var Review;
  var Auth;

  var firebase;
  var moment;
  var _;

  var $timeout;

  var users = {
    'c36c1a3f-6655-4f31-b0a4-971fdc87fbe6': {
      id: 'c36c1a3f-6655-4f31-b0a4-971fdc87fbe6',
      anonymous: false,
      authProvider: 'password',
      created: '2015-11-05T05:00:00+00:00',
      name: 'Anonymous',
      profileImageUrl: 'assets/images/avatars/anonymous.png'
    },
    'github:10051883': {
      id: 'github:10051883',
      anonymous: true,
      authProvider: 'github',
      created: '2016-02-24T23:08:29+00:00',
      name: 'Khang Pham',
      profileImageUrl: 'https://avatars.githubusercontent.com/u/10051883?v=3'
    },
    'dda7acf2-e878-43aa-9975-3cbe35aa42e8': {
      id: 'dda7acf2-e878-43aa-9975-3cbe35aa42e8',
      anonymous: false,
      authProvider: 'password',
      created: '2015-11-09T22:02:26+00:00',
      email: 'ecorp@gatech.edu',
      name: 'Eduardo Corpeño',
      profileImageUrl: 'https://secure.gravatar.com/avatar/e36569095458e7c66e6fd50bd44b79d0?s=200&d=mm',
      specialization: 2
    },
    '5833a6cd-f81c-47f6-af7e-ad751e7657d6': {
      id: '5833a6cd-f81c-47f6-af7e-ad751e7657d6',
      anonymous: true,
      authProvider: 'password',
      created: '2016-04-25T21:54:53+00:00',
      email: 'jace@gatech.edu',
      name: 'jace',
      profileImageUrl: 'https://secure.gravatar.com/avatar/65b45cf2ffcd49178776de5422f4f771?s=200&d=mm',
      specialization: 2
    }
  };

  var courses = {
    '6460': {
      department: 'CS',
      foundational: false,
      icon: 'school',
      name: 'Educational Technology',
      number: 6460
    },
    '6505': {
      department: 'CS',
      foundational: true,
      icon: 'keyboard-off',
      name: 'Computability, Complexity & Algorithms',
      number: 6505
    },
    '6300': {
      department: 'CS',
      foundational: true,
      icon: 'git',
      name: 'Software Development Process',
      number: 6300
    }
  };

  var semesters = {
    '2016-1': {
      season: 1,
      year: 2016
    },
    '2015-3': {
      season: 3,
      year: 2015
    }
  };

  var reviews = [{
    id: '-K2Q2yDLqpmXk7WmewXD',
    author: 'c36c1a3f-6655-4f31-b0a4-971fdc87fbe6',
    course: '6460',
    created: '2015-11-05T06:00:00+00:00',
    difficulty: 3,
    semester: '2015-3',
    text: 'I put the difficulty...',
    updated: '2015-11-05T06:00:00+00:00',
    workload: 10,
    authorName: 'Anonymous',
    authorImageUrl: 'assets/images/avatars/anonymous.png',
    courseTitle: '6460 Educational Technology',
    semesterName: 'Fall 2015'
  },{
    id: '-K2Q2yDLqpmXk7WmewXE',
    author: 'c36c1a3f-6655-4f31-b0a4-971fdc87fbe6',
    course: '6505',
    created: '2015-11-05T06:00:00+00:00',
    difficulty: 3,
    semester: '2015-3',
    text: 'If you are familiar ...',
    updated: '2015-11-05T06:00:00+00:00',
    workload: 10,
    authorName: 'Anonymous',
    authorImageUrl: 'assets/images/avatars/anonymous.png',
    courseTitle: '6505 Computability, Complexity & Algorithms',
    semesterName: 'Fall 2015'
  },{
    id: '-K2Q2yDLqpmXk7WmewXF',
    author: 'c36c1a3f-6655-4f31-b0a4-971fdc87fbe6',
    course: '6300',
    created: '2015-11-05T06:00:00+00:00',
    difficulty: 3,
    semester: '2015-3',
    text: 'This class can\'t rea...',
    updated: '2015-11-05T06:00:00+00:00',
    workload: 10,
    authorName: 'Anonymous',
    authorImageUrl: 'assets/images/avatars/anonymous.png',
    courseTitle: '6300 Software Development Process',
    semesterName: 'Fall 2015'
  },{
    id: '-KBK_lXeTyE8d3ud8_ti',
    author: 'github:10051883',
    course: '6460',
    created: '2016-02-24T23:22:17+00:00',
    difficulty: 3,
    semester: '2016-1',
    text: 'Requires writing/re...',
    updated: '2016-02-24T23:22:56+00:00',
    workload: 10,
    authorName: 'Anonymous',
    authorImageUrl: 'assets/images/avatars/anonymous.png',
    courseTitle: '6460 Educational Technology',
    semesterName: 'Spring 2016'
  },{
    id: '-KD2CVOgmEUXXzK6aHsd',
    author: 'dda7acf2-e878-43aa-9975-3cbe35aa42e8',
    course: '6460',
    created: '2016-03-17T06:14:29+00:00',
    difficulty: 3,
    rating: 4,
    semester: '2016-1',
    text: 'This is a class stru...',
    updated: '2016-05-11T21:10:01+00:00',
    workload: 10,
    authorName: 'Eduardo Corpeño',
    authorImageUrl: 'https://secure.gravatar.com/avatar/e36569095458e7c66e6fd50bd44b79d0?s=200&d=mm',
    courseTitle: '6460 Educational Technology',
    semesterName: 'Spring 2016'
  }];

  var review = {
    id: '-KGERwTmXmo6jB_o1_y6',
    author: 'c36c1a3f-6655-4f31-b0a4-971fdc87fbe6',
    course: '6460',
    created: '2016-04-25T22:04:28+00:00',
    difficulty: 3,
    rating: 5,
    semester: '2016-1',
    text: 'For the most part th...',
    updated: '2016-04-25T22:04:28+00:00',
    workload: 15,
    authorName: 'Anonymous',
    authorImageUrl: 'assets/images/avatars/anonymous.png',
    courseTitle: '6460 Educational Technology',
    semesterName: 'Spring 2016'
  };

  var currentMoment;
  var recentMoment;

  function unDenormalize(review) {
    return _.omit(review, ['id', 'authorName', 'authorImageUrl', 'courseTitle', 'semesterName']);
  }

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector) {
    Review = $injector.get('Review');
    Auth = $injector.get('Auth');

    firebase = $injector.get('firebase');
    _ = $injector.get('_');
    moment = $injector.get('moment');

    $timeout = $injector.get('$timeout');
  }));

  beforeEach(function () {
    Review.clear();

    firebase.clear();
    firebase.database().ref('users').set(users);
    firebase.database().ref('semesters').set(semesters);
    firebase.database().ref('courses').set(courses);
    firebase.database()
      .ref('reviews')
      .set(_.chain(reviews)
        .map(function (r) {
          return [r.id, unDenormalize(r)];
        })
        .fromPairs()
        .value());

    $timeout.flush();

    currentMoment = '2017-01-01T01:01:01+00:00';
    recentMoment = moment().subtract(7, 'days').startOf('day').add(1, 's').utc();

    spyOn(firebase, 'database').and.callThrough();
  });

  describe('getByCourse', function () {
    var courseId;
    var courseReviews;

    beforeEach(function () {
      courseId = '6460';
      courseReviews = _.filter(reviews, ['course', courseId]);
    });

    it('loads from database on cache miss', function (done) {
      Review.getByCourse(courseId).then(function (result) {
        expect(result).toEqual(courseReviews);
        expect(firebase.database).toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('loads from cache on cache hit', function (done) {
      Review.getByCourse(courseId).then(function () {
        firebase.database.calls.reset();

        Review.getByCourse(courseId).then(function (result) {
          expect(result).toEqual(courseReviews);
          expect(firebase.database).not.toHaveBeenCalled();
          done();
        });
      });

      $timeout.flush();
    });

    it('allows skipping the cache', function (done) {
      Review.getByCourse(courseId).then(function () {
        firebase.database.calls.reset();

        Review.getByCourse(courseId, true).then(function (result) {
          expect(result).toEqual(courseReviews);
          expect(firebase.database).toHaveBeenCalled();
          done();
        });
      });

      $timeout.flush();
    });
  });

  describe('getByUser', function () {
    var userId;
    var userReviews;

    beforeEach(function () {
      userId = 'c36c1a3f-6655-4f31-b0a4-971fdc87fbe6';
      userReviews = _.filter(reviews, ['author', userId]);
    });

    it('loads from database on cache miss', function (done) {
      Review.getByUser(userId).then(function (result) {
        expect(result).toEqual(userReviews);
        expect(firebase.database).toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('loads from cache on cache hit', function (done) {
      Review.getByUser(userId).then(function () {
        firebase.database.calls.reset();

        Review.getByUser(userId).then(function (result) {
          expect(result).toEqual(userReviews);
          expect(firebase.database).not.toHaveBeenCalled();
          done();
        });
      });

      $timeout.flush();
    });
  });

  describe('getRecent', function () {
    var originalMoments = [];

    beforeEach(function () {
      originalMoments[0] = reviews[0].created;
      originalMoments[3] = reviews[3].created;

      reviews[0].created = recentMoment.format();
      reviews[3].created = recentMoment.add(2, 'days').format();

      firebase.database().ref('reviews').child(reviews[0].id).child('created').set(reviews[0].created);
      firebase.database().ref('reviews').child(reviews[3].id).child('created').set(reviews[3].created);
    });

    afterEach(function () {
      reviews[0].created = originalMoments[0];
      reviews[3].created = originalMoments[3];

      firebase.database().ref('reviews').child(reviews[0].id).child('created').set(reviews[0].created);
      firebase.database().ref('reviews').child(reviews[3].id).child('created').set(reviews[3].created);
    });

    it('loads reviews published in the last 7 days', function (done) {
      Review.getRecent().then(function (result) {
        expect(result).toEqual([reviews[0], reviews[3]]);
        done();
      });

      $timeout.flush();
    });
  });

  describe('isRecent', function () {
    var isRecent;

    it('detects a recent moment', function () {
      isRecent = Review.isRecent({ created: recentMoment.format() });
      expect(isRecent).toBe(true);
    });

    it('detects a non-recent moment', function () {
      isRecent = Review.isRecent({ created: moment(recentMoment).subtract(1, 'h').utc().format() });
      expect(isRecent).toBe(false);
    });
  });

  describe('update', function () {
    var props = ['semester', 'difficulty', 'workload', 'rating', 'text'];

    beforeEach(function () {
      moment.utc = _.constant({ format: _.constant(currentMoment) });

      firebase.database().ref('reviews').child(review.id).set(unDenormalize(review));
    });

    afterEach(function () {
      firebase.database().ref('reviews').child(review.id).remove();
    });

    it('commits updates to database', function (done) {
      var updates = {
        semester: '2015-3',
        difficulty: 1,
        workload: 1,
        rating: 1,
        text: 'Blah blah blah...'
      };
      var updated = _.chain(review).clone().assign(updates).value();
      var semesterName = 'Fall 2015';

      Review.update(updated).then(function (result) {
        expect(_.pick(result, props)).toEqual(updates);
        expect(updated.semesterName).toEqual(semesterName);
        expect(result.updated).toEqual(currentMoment);

        firebase.database().ref('reviews').child(review.id).once('value').then(function (snapshot) {
          expect(_.pick(snapshot.val(), props)).toEqual(updates);
          expect(snapshot.val().updated).toEqual(currentMoment);
          done();
        });
      });

      $timeout.flush();
    });
  });

  describe('remove', function () {
    beforeEach(function () {
      firebase.database().ref('reviews').child(review.id).set(unDenormalize(review));
    });

    afterEach(function () {
      firebase.database().ref('reviews').child(review.id).remove();
    });

    it('commits removal to database', function (done) {
      Review.remove(review).then(function (result) {
        expect(result).toEqual(review);

        firebase.database().ref('reviews').child(review.id).once('value').then(function (snapshot) {
          expect(snapshot.exists()).toBe(false);
          done();
        });
      });

      $timeout.flush();
    });
  });

  describe('push', function () {
    var reviewToPush;

    beforeEach(function () {
      reviewToPush = unDenormalize(review);

      spyOn(Auth, 'getCurrentUserSync').and.returnValue({ id: review.author });

      moment.utc = _.constant({ format: _.constant(currentMoment) });
    });

    it('commits a push to database', function (done) {
      Review.push(reviewToPush).then(function (result) {
        expect(_.omit(result, ['id', 'created'])).toEqual(_.omit(review, ['id', 'created']));
        expect(result.created).toEqual(currentMoment);

        firebase.database().ref('reviews').child(result.id).once('value').then(function (snapshot) {
          expect(_.omit(snapshot.val(), 'created')).toEqual(_.omit(reviewToPush, 'created'));
          expect(snapshot.val().created).toEqual(currentMoment);
          done();
        });
      });

      $timeout.flush();
    });

    it('fails gracefully on error', function (done) {
      firebase.error = true;

      Review.push().catch(function (result) {
        expect(result).toEqual('ERROR');

        firebase.error = false;
        done();
      });

      $timeout.flush();
    });
  });
});
