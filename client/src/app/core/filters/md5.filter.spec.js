'use strict';

describe('filter: md5', function () {
  var $filter;
  var md5;

  beforeEach(module('app'));

  beforeEach(inject(function ($injector) {
    $filter = $injector.get('$filter');

    md5 = $filter('md5');
  }));

  it('hashes long strings', function () {
    var string = Array(13).join('abcdefghij');
    var hash = md5(string);
    expect(typeof hash).toBe('string');
    expect(hash.length).toEqual(32);
  });

  it('hashes short strings', function () {
    var string = Array(2).join('abcdefghij');
    var hash = md5(string);
    expect(typeof hash).toBe('string');
    expect(hash.length).toEqual(32);
  });

  it('returns a sequence of zeros for null input', function () {
    var hash = md5(null);
    expect(hash).toMatch(/^(0){32}$/);
  });
});
