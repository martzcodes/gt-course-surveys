'use strict';

describe('service: Course', function () {
  var Course;

  var firebase;
  var _;

  var $timeout;

  var courses = [{
    id: '6035',
    department: 'CS',
    foundational: false,
    icon: 'icon-security',
    name: 'Intro to Information Security',
    number: 6035,
    title: '6035 Intro to Information Security'
  },{
    id: '8803-BDHI',
    department: 'CSE',
    foundational: false,
    icon: 'icon-data',
    name: 'Big Data for Health Informatics',
    number: 8803,
    section: 1,
    title: '8803-1 Big Data for Health Informatics'
  }];

  function unDenormalize(course) {
    return _.chain(course)
      .omit(['id', 'title'])
      .assign({icon: course.icon.replace('icon-', '')})
      .value();
  }

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector) {
    Course = $injector.get('Course');

    firebase = $injector.get('firebase');
    _ = $injector.get('_');

    $timeout = $injector.get('$timeout');
  }));

  describe('all', function () {
    beforeEach(function () {
      firebase.clear();
      firebase.database()
        .ref('courses')
        .set(_.chain(courses)
          .map(function (c) {
            return [c.id, unDenormalize(c)];
          })
          .fromPairs()
          .value());

      $timeout.flush();

      spyOn(firebase, 'database').and.callThrough();
    });

    beforeEach(function () {
      Course.clear();
    });

    afterEach(function () {
      firebase.database.calls.reset();
    });

    it('loads from database on cache miss', function (done) {
      Course.all().then(function (result) {
        expect(result).toEqual(courses);
        expect(firebase.database).toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('loads from cache on cache hit', function (done) {
      Course.all().then(function () {
        firebase.database.calls.reset();

        Course.all().then(function (result) {
          expect(result).toEqual(courses);
          expect(firebase.database).not.toHaveBeenCalled();
          done();
        });
      });

      $timeout.flush();
    });
  });

  describe('get', function () {
    var id;
    var course;

    beforeEach(function () {
      id = '6035';
      course = _.find(courses, ['id', id]);

      firebase.clear();
      firebase.database().ref('courses').child(id).set(unDenormalize(course));

      $timeout.flush();

      spyOn(firebase, 'database').and.callThrough();
    });

    beforeEach(function () {
      Course.clear();
    });

    afterEach(function () {
      firebase.database.calls.reset();
    });

    it('loads from database on cache miss', function (done) {
      Course.get(id).then(function (result) {
        expect(result).toEqual(course);
        expect(firebase.database).toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('loads from cache on cache hit', function (done) {
      Course.get(id).then(function () {
        firebase.database.calls.reset();

        Course.get(id).then(function (result) {
          expect(result).toEqual(course);
          expect(firebase.database).not.toHaveBeenCalled();
          done();
        });
      });

      $timeout.flush();
    });
  });
});
