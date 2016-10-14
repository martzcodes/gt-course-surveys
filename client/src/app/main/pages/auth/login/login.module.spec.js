'use strict';

describe('module: app.pages.auth.login', function () {
  var $rootScope;
  var $state;
  var $q;

  var Auth;

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector, $templateCache) {
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    $q = $injector.get('$q');

    Auth = $injector.get('Auth');

    $templateCache.put('app/core/layouts/content-only.html', '');
    $templateCache.put('app/core/layouts/vertical-navigation.html', '');
    $templateCache.put('app/toolbar/layouts/vertical-navigation/toolbar.html', '');
    $templateCache.put('app/navigation/layouts/vertical-navigation/navigation.html', '');
    $templateCache.put('app/quick-panel/quick-panel.html', '');
    $templateCache.put('app/main/pages/auth/login/login.html', '');

    spyOn(Auth, 'waitForCurrentUser').and.returnValue($q.resolve(null));

    $state.go('app.pages_auth_login');
    $rootScope.$digest();
  }));

  it('waits for authentication state', function () {
    expect(Auth.waitForCurrentUser).toHaveBeenCalled();
  });
});
