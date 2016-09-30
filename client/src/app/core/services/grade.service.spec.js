'use strict';

describe('service: Grade', function () {
  var Grade;
  var firebase;

  var $timeout;

  var grades = {
    '6035': {
      '2015-3': { a: 126, b: 97, c: 6, d: 0, f: 0, i: 0, s: 0, t: 245, u: 0, v: 0, w: 16 },
      '2016-1': { a: 235, b: 66, c: 6, d: 7, f: 0, i: 1, s: 0, t: 342, u: 0, v: 0, w: 27 }
    },
    '6210': {
      '2014-1': { a:  36, b:  7, c: 0, d: 2, f: 0, i: 0, s: 0, t: 105, u: 0, v: 0, w: 60 }
    }
  };
  var gradesDenormalized = {
    '6035': {
      '2015-3': {
        '#': { a: 126,   b: 97,    c: 6,   d: 0,   f: 0, i: 0,   s: 0, t: 245, u: 0, v: 0, w: 16   },
        '%': { a:  51.4, b: 39.6,  c: 2.4, d: 0,   f: 0, i: 0,   s: 0, t: 100, u: 0, v: 0, w:  6.5 },
        '~': { a:  55,   b: 42.4,  c: 2.6, d: 0,   f: 0, i: 0,   s: 0, t: 100, u: 0, v: 0, w:  0   }
      },
      '2016-1': {
        '#': { a: 235,   b: 66,    c: 6,   d: 7,   f: 0, i: 1,   s: 0, t: 342, u: 0, v: 0, w: 27   },
        '%': { a:  68.7, b: 19.3,  c: 1.8, d: 2,   f: 0, i: 0.3, s: 0, t: 100, u: 0, v: 0, w:  7.9 },
        '~': { a:  74.6, b: 21,    c: 1.9, d: 2.2, f: 0, i: 0.3, s: 0, t: 100, u: 0, v: 0, w:  0   }
      },
      'all': {
        '#': { a: 361,   b: 163,   c: 12,  d: 7,   f: 0, i: 1,   s: 0, t: 587, u: 0, v: 0, w: 43   },
        '%': { a:  61.5, b:  27.8, c:  2,  d: 1.2, f: 0, i: 0.2, s: 0, t: 100, u: 0, v: 0, w:  7.3 },
        '~': { a:  66.4, b:  30,   c: 2.2, d: 1.3, f: 0, i: 0.2, s: 0, t: 100, u: 0, v: 0, w:  0   }
      }
    },
    '6210': {
      '2014-1': {
        '#': { a: 36,    b:  7,    c: 0,   d: 2,   f: 0, i: 0,   s: 0, t: 105, u: 0, v: 0, w: 60   },
        '%': { a: 34.3,  b:  6.7,  c: 0,   d: 1.9, f: 0, i: 0,   s: 0, t: 100, u: 0, v: 0, w: 57.1 },
        '~': { a: 80,    b: 15.6,  c: 0,   d: 4.4, f: 0, i: 0,   s: 0, t: 100, u: 0, v: 0, w:  0   }
      },
      'all': {
        '#': { a: 36,    b:  7,    c: 0,   d: 2,   f: 0, i: 0,   s: 0, t: 105, u: 0, v: 0, w: 60   },
        '%': { a: 34.3,  b:  6.7,  c: 0,   d: 1.9, f: 0, i: 0,   s: 0, t: 100, u: 0, v: 0, w: 57.1 },
        '~': { a: 80,    b: 15.6,  c: 0,   d: 4.4, f: 0, i: 0,   s: 0, t: 100, u: 0, v: 0, w:  0   }
      }
    }
  };

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector) {
    Grade = $injector.get('Grade');
    firebase = $injector.get('firebase');

    $timeout = $injector.get('$timeout');
  }));

  describe('all', function () {
    beforeEach(function () {
      Grade.clear();

      firebase.clear();
      firebase.database().ref('grades').set(grades);

      $timeout.flush();

      spyOn(firebase, 'database').and.callThrough();
    });

    afterEach(function () {
      firebase.database.calls.reset();
    });

    it('loads from database on cache miss', function (done) {
      Grade.all().then(function (result) {
        expect(result).toEqual(gradesDenormalized);
        expect(firebase.database).toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('loads from cache on cache hit', function (done) {
      Grade.all().then(function () {
        firebase.database.calls.reset();

        Grade.all().then(function (result) {
          expect(result).toEqual(gradesDenormalized);
          expect(firebase.database).not.toHaveBeenCalled();
          done();
        });
      });

      $timeout.flush();
    });
  });

  describe('get', function () {
    var courseId;

    beforeEach(function () {
      courseId = '6035';

      Grade.clear();

      firebase.clear();
      firebase.database().ref('grades').set(grades);

      $timeout.flush();

      spyOn(firebase, 'database').and.callThrough();
    });

    afterEach(function () {
      firebase.database.calls.reset();
    });

    it('loads from database on cache miss', function (done) {
      Grade.get(courseId).then(function (result) {
        expect(result).toEqual(gradesDenormalized[courseId]);
        expect(firebase.database).toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });

    it('loads from cache on cache hit', function (done) {
      Grade.get(courseId).then(function () {
        firebase.database.calls.reset();

        Grade.get(courseId).then(function (result) {
          expect(result).toEqual(gradesDenormalized[courseId]);
          expect(firebase.database).not.toHaveBeenCalled();
          done();
        });
      });

      $timeout.flush();
    });
  });

  describe('none', function () {
    it('defines an empty grade distribution', function () {
      var none = Grade.none();

      expect(none['#']).toEqual({ a: 0, b: 0, c: 0, d: 0, f: 0, i: 0, s: 0, u: 0, v: 0, w: 0, t: 0 });
      expect(none['%']).toEqual({ a: 0, b: 0, c: 0, d: 0, f: 0, i: 0, s: 0, u: 0, v: 0, w: 0, t: 0 });
      expect(none['~']).toEqual({ a: 0, b: 0, c: 0, d: 0, f: 0, i: 0, s: 0, u: 0, v: 0, w: 0, t: 0 });
    });
  });

  it('guards against divide-by-zero', function (done) {
    var badData = {
      '6035': {
'2015-3': { a: 0, b: 0, t: 0 }
      }
    };
    var badDataDenormalized = {
      '6035': {
'2015-3': {
  '#': { a: 0, b: 0, t: 0   },
  '%': { a: 0, b: 0, t: 100 },
  '~': { a: 0, b: 0, t: 100, w: 0 }
        },
'all': {
  '#': { a: 0, b: 0, t: 0   },
  '%': { a: 0, b: 0, t: 100 },
  '~': { a: 0, b: 0, t: 100, w: 0 }
        }
      }
    };

    Grade.clear();

    firebase.clear();
    firebase.database().ref('grades').set(badData);

    $timeout.flush();

    Grade.all().then(function (result) {
      expect(result).toEqual(badDataDenormalized);
      done();
    });

    $timeout.flush();
  });
});
