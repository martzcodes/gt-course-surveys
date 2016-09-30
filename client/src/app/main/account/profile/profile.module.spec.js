'use strict';

describe('module: app.account.profile', function () {
  var $rootScope;
  var $state;
  var $q;

  var Auth;

  var user = { id: 'foo' };

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector, $templateCache) {
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    $q = $injector.get('$q');

    Auth = $injector.get('Auth');

    $templateCache.put('app/core/layouts/vertical-navigation.html', '');
    $templateCache.put('app/toolbar/layouts/vertical-navigation/toolbar.html', '');
    $templateCache.put('app/navigation/layouts/vertical-navigation/navigation.html', '');
    $templateCache.put('app/quick-panel/quick-panel.html', '');
    $templateCache.put('app/main/account/profile/profile.html', '');

    spyOn(Auth, 'requireCurrentUserData').and.returnValue($q.resolve(user));

    $state.go('app.account_profile');
    $rootScope.$digest();
  }));

  it('requires current user data', function () {
    expect(Auth.requireCurrentUserData).toHaveBeenCalled();
  });
});
