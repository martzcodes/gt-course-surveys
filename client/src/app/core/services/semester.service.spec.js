'use strict';

describe('service: Semester', function () {
  var Semester;

  var firebase;
  var _;

  var $timeout;

  var semesters = [{
    id: '0000-0',
    season: 0,
    year: 0,
    name: 'Unknown'
  },{
    id: '2016-1',
    season: 1,
    year: 2016,
    name: 'Spring 2016'
  },{
    id: '2016-2',
    season: 2,
    year: 2016,
    name: 'Summer 2016'
  },{
    id: '2016-3',
    season: 3,
    year: 2016,
    name: 'Fall 2016'
  }];

  function unDenormalize(semester) {
    return _.omit(semester, ['id', 'name']);
  }

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector) {
    Semester = $injector.get('Semester');

    firebase = $injector.get('firebase');
    _ = $injector.get('_');

    $timeout = $injector.get('$timeout');
  }));

  describe('isUnknown', function () {
    it('recognizes the unknown semester', function () {
      var semester = semesters[0];

      expect(Semester.isUnknown(semester)).toBe(true);
    });

    it('recognizes a known semester', function () {
      var semester = semesters[1];

      expect(Semester.isUnknown(semester)).toBe(false);
    });
  });

  describe('all', function () {
    beforeEach(function () {
      Semester.clear();

      firebase.clear();
      firebase.database()
        .ref('semesters')
        .set(_.chain(semesters)
          .map(function (s) {
            return [s.id, unDenormalize(s)];
          })
          .fromPairs()
          .value());

      $timeout.flush();

      spyOn(firebase, 'database').and.callThrough();
    });

    afterEach(function () {
      firebase.database.calls.reset();
    });

    it('loads from database on cache miss', function (done) {
      Semester.all().then(function (result) {
        expect(result).toEqual(semesters);
        expect(firebase.database).toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('loads from cache on cache hit', function (done) {
      Semester.all().then(function () {
        firebase.database.calls.reset();

        Semester.all().then(function (result) {
          expect(result).toEqual(semesters);
          expect(firebase.database).not.toHaveBeenCalled();
          done();
        });
      });

      $timeout.flush();
    });
  });

  describe('get', function () {
    var id;
    var semester;

    beforeEach(function () {
      id = '2016-3';
      semester = _.find(semesters, ['id', id]);

      Semester.clear();

      firebase.clear();
      firebase.database().ref('semesters').child(id).set(unDenormalize(semester));

      $timeout.flush();

      spyOn(firebase, 'database').and.callThrough();
    });

    afterEach(function () {
      firebase.database.calls.reset();
    });

    it('loads from database on cache miss', function (done) {
      Semester.get(id).then(function (result) {
        expect(result).toEqual(semester);
        expect(firebase.database).toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('loads from cache on cache hit', function (done) {
      Semester.get(id).then(function () {
        firebase.database.calls.reset();

        Semester.get(id).then(function (result) {
          expect(result).toEqual(semester);
          expect(firebase.database).not.toHaveBeenCalled();
          done();
        });
      });

      $timeout.flush();
    });
  });
});
