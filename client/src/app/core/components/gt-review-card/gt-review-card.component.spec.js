'use strict';

describe('component: gtReviewCard', function () {
  var $componentController;
  var vm;
  var $location;

  var _;
  var msUtils;
  var Auth;
  var user = {
    id: 'I3Hg5Bmw87aFbe24XmWbnF5hvUz2',
    anonymous: false,
    authProvider: 'password',
    created: '2016-08-17T15:20:03Z',
    name: 'Mehmet Bajin',
    email: 'mehmet.bajin@gatech.edu',
    profileImageUrl: 'https://www.gravatar.com/avatar/4263f982cbcf49e470937d9e6cc627a3?s=200&d=mm'
  };

  var onEditSpy = jasmine.createSpy('onEdit');
  var onRemoveSpy = jasmine.createSpy('onRemove');

  var review = {
    id: '-K2Q2yAnCsH4KiqDwVy4',
    author: 'c36c1a3f-6655-4f31-b0a4-971fdc87fbe6',
    course: '6505',
    created: '2016-11-05T06:00:00+00:00',
    difficulty: 5,
    rating: 2,
    semester: '2014-3',
    text: 'I dropped it this semester so I can take it by itself.',
    updated: '2016-11-12T06:00:00+00:00',
    workload: 15
  };

  var $event = { foo: 'bar' };

  var translations = { CORE: { COPIED: 'Copied.', IMPORTED: 'Imported.' } };

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', translations);
  }));

  beforeEach(inject(function ($injector) {
    $componentController = $injector.get('$componentController');
    $location = $injector.get('$location');

    _ = $injector.get('_');
    msUtils = $injector.get('msUtils');

    Auth = $injector.get('Auth');
    spyOn(Auth, 'getCurrentUserSync').and.returnValue(user);

    vm = $componentController('gtReviewCard', null, {
      review: review,
      showCourseTitle: false,
      readOnly: false,
      onEdit: onEditSpy,
      onRemove: onRemoveSpy
    });
  }));

  it('caches the current user', function () {
    expect(vm.user).toEqual(user);
  });

  describe('vm.createdTimeOf', function () {
    it('returns imported for imported reviews', function () {
      var tests = [
        _.chain(review).clone().assign({ created: '2015-11-05T06:00:00+00:00' }).value(),
        _.chain(review).clone().assign({ updated: '2015-11-05T06:00:00+00:00' }).value()
      ];

      _.forEach(tests, function (test) {
        var time = vm.createdTimeOf(test);

        expect(time).toEqual(translations.CORE.IMPORTED);
      });
    });

    it('returns formatted datetime for non-imported reviews', function () {
      var time = vm.createdTimeOf(review);

      expect(time).toBe('11/4/16, 11:00 pm');
    });
  });

  describe('vm.linkOf', function () {
    var absUrl = 'https://omscentral.com/reviews/6505';

    it('produces the correct deep link', function () {
      spyOn($location, 'absUrl').and.returnValue(absUrl);

      var url = vm.linkOf(review);

      expect(url).toEqual(absUrl + '?rid=' + review.id);
    });
  });

  describe('vm.onLinkCopied', function () {
    it('displays a confirmation toast', function () {
      spyOn(msUtils, 'toast');

      vm.onLinkCopied();

      expect(msUtils.toast).toHaveBeenCalledWith(translations.CORE.COPIED);
    });
  });

  describe('vm.showButtons', function () {
    it('returns false if there is no user', function () {
      vm.user = null;

      expect(vm.showButtons()).toBeFalsy();

      vm.user = user;
    });

    it('returns false if current user is not the review author', function () {
      vm.user = user;
      vm.review = review;

      expect(vm.showButtons()).toBeFalsy();
    });

    it('returns true if current user is the review author', function () {
      vm.user = user;
      vm.review = _.chain(review).clone().assign({ author: user.id }).value();

      expect(vm.showButtons()).toBeTruthy();
    });
  });

  describe('vm.edit', function () {
    it('delegates to edit handler', function () {
      vm.edit($event, review);

      expect(onEditSpy).toHaveBeenCalledWith({ event: $event, review: review });
    });
  });

  describe('vm.remove', function () {
    it('delegates to remove handler', function () {
      vm.remove($event, review);

      expect(onRemoveSpy).toHaveBeenCalledWith({ event: $event, review: review });
    });
  });
});
