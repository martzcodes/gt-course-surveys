'use strict';

describe('filter: basic', function () {
  var _;
  var $filter;

  var md5;
  var gtGravatarUrl;
  var gtSpecialization;
  var gtDifficulty;
  var gtWorkload;
  var gtRating;

  beforeEach(module('app'));

  beforeEach(inject(function ($injector) {
    _ = $injector.get('_');
    $filter = $injector.get('$filter');

    md5 = $filter('md5');
    gtGravatarUrl = $filter('gtGravatarUrl');
    gtSpecialization = $filter('gtSpecialization');
    gtDifficulty = $filter('gtDifficulty');
    gtWorkload = $filter('gtWorkload');
    gtRating = $filter('gtRating');
  }));

  describe('gtGravatarUrl', function () {
    var hash;
    var url;
    var urlBegin = 'https://www.gravatar.com/avatar/';

    beforeEach(function () {
      var email = 'user@email.com';
      hash = md5(email);
      url = gtGravatarUrl(email);
    });

    it('includes the correct address', function () {
      expect(url.indexOf(urlBegin)).toEqual(0);
    });

    it('includes email hash', function () {
      expect(url.indexOf(hash)).toEqual(urlBegin.length);
    });

    it('requests a 200px image', function () {
      expect(url.split(/[&\?]/g)).toContain('s=200');
    });

    it('defaults to masked man', function () {
      expect(url.split(/[&\?]/g)).toContain('d=mm');
    });
  });

  describe('gtSpecialization', function () {
    it('returns a string for valid specializations', function () {
      var tests = [0,1,2,3];

      _.forEach(tests, function (test) {
        var result = gtSpecialization(test);

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    it('returns empty string for invalid specializations', function () {
      var tests = ['foo', null, -1, false, undefined];
      _.forEach(tests, function (test) {
        var result = gtSpecialization(test);

        expect(result).toEqual('');
      });
    });
  });

  describe('gtDifficulty', function () {
    it('returns a string token for valid difficulties', function () {
      var tests = [[1,'A'],[2,'B'],[3,'C'],[4,'D'],[5,'E']];

      _.forEach(tests, function (test) {
        var result = gtDifficulty(test[0]);

        expect(result).toEqual('CORE.DIFFICULTY.' + test[1]);
      });
    });

    it('returns empty string for invalid difficulties', function () {
      var tests = ['foo', null, -1, false, undefined];

      _.forEach(tests, function (test) {
        var result = gtDifficulty(test);

        expect(result).toEqual('');
      });
    });
  });

  describe('gtWorkload', function () {
    it('returns singular string token when workload is 1', function () {
      var workload = 1;

      var result = gtWorkload(workload);

      expect(result).toEqual('CORE.HOUR_PER_WEEK');
    });

    it('returns plural string token for valid workloads that are not 1', function () {
      var tests = [0,2,3,4,100];

      _.forEach(tests, function (test) {
        var result = gtWorkload(test);

        expect(result).toEqual('CORE.HOURS_PER_WEEK');
      });
    });

    it('returns empty string for invalid workloads', function () {
      var tests = ['foo', null, -1, false, undefined];

      _.forEach(tests, function (test) {
        var result = gtWorkload(test);

        expect(result).toEqual('');
      });
    });
  });

  describe('gtRating', function () {
    it('returns a string token for valid ratings', function () {
      var tests = [[1,'A'],[2,'B'],[3,'C'],[4,'D'],[5,'E']];

      _.forEach(tests, function (test) {
        var result = gtRating(test[0]);

        expect(result).toEqual('CORE.RATING.' + test[1]);
      });
    });

    it('returns empty string for invalid ratings', function () {
      var tests = ['foo', null, -1, false, undefined];

      _.forEach(tests, function (test) {
        var result = gtRating(test);

        expect(result).toEqual('');
      });
    });
  });
});
