'use strict';

describe('module: app.account.reviews', function () {
  var $rootScope;
  var $state;
  var $q;

  var Auth;
  var Review;

  var user = { id: 'foo' };

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector, $templateCache) {
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    $q = $injector.get('$q');

    Auth = $injector.get('Auth');
    Review = $injector.get('Review');

    $templateCache.put('app/core/layouts/vertical-navigation.html', '');
    $templateCache.put('app/toolbar/layouts/vertical-navigation/toolbar.html', '');
    $templateCache.put('app/navigation/layouts/vertical-navigation/navigation.html', '');
    $templateCache.put('app/quick-panel/quick-panel.html', '');
    $templateCache.put('app/main/account/my-reviews/my.html', '');

    spyOn(Auth, 'requireCurrentUser').and.returnValue($q.resolve(user));
    spyOn(Auth, 'requireCurrentUserData').and.returnValue($q.resolve(user));
    spyOn(Review, 'getByUser').and.returnValue($q.resolve([]));

    $state.go('app.account_reviews');
    $rootScope.$digest();
  }));

  it('requires current user data', function () {
    expect(Auth.requireCurrentUserData).toHaveBeenCalled();
  });

  it('loads reviews by current user', function () {
    expect(Auth.requireCurrentUser).toHaveBeenCalled();
    expect(Review.getByUser).toHaveBeenCalledWith(user.id);
  });
});
