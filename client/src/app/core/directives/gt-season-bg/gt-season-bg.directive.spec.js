'use strict';

describe('directive: gtSeasonBg', function () {
  var $rootScope;
  var $compile;
  var $element;

  var currentMonth = 'august';
  var momentFormatSpy = jasmine.createSpy('moment.format').and.returnValue(currentMonth);
  var imageRegex;

  beforeEach(module('app', function ($translateProvider, $provide) {
    $translateProvider.translations('en', {});

    $provide.constant('moment', function () {
      return { format: momentFormatSpy };
    });
  }));

  beforeEach(inject(function ($injector) {
    $rootScope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');

    $element = $compile('<div gt-season-bg></div>')($rootScope);
    $rootScope.$digest();

    imageRegex = new RegExp([
      '^',
        'url[(]',
          '"?',
            '(http:\/\/localhost:[0-9]{4})?',
            '\/assets\/images\/backgrounds\/' + currentMonth + '[.]jpg',
          '"?',
        '[)]',
      '$'
    ].join(''));
  }));

  it('sets background of element based on current month', function () {
    expect(momentFormatSpy).toHaveBeenCalledWith('MMMM');

    expect($element.css('background-image')).toMatch(imageRegex);
    expect($element.css('background-size')).toEqual('cover');
    expect($element.css('background-position')).toEqual('0% 0%');
    expect($element.css('background-repeat')).toEqual('no-repeat');
  });
});
