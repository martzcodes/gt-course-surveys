'use strict';

describe('controller: ToolbarController', function () {
  var vm;

  var $rootScope;
  var $q;
  var $timeout;
  var $state;
  var $cookies;
  var $translate;

  var msNavigationService;
  var msUtils;

  var Auth;
  var eventCode;

  var $mdSidenavToggle;
  var $mdSidenav;

  beforeEach(module('app', function ($translateProvider) {
    $translateProvider.translations('en', {});
  }));

  beforeEach(inject(function ($injector, $controller) {
    $rootScope = $injector.get('$rootScope');

    $q = $injector.get('$q');
    $timeout = $injector.get('$timeout');
    $state = $injector.get('$state');
    $cookies = $injector.get('$cookies');
    $translate = $injector.get('$translate');

    msNavigationService = $injector.get('msNavigationService');
    msUtils = $injector.get('msUtils');

    Auth = $injector.get('Auth');
    eventCode = $injector.get('eventCode');

    $mdSidenavToggle = jasmine.createSpy();
    $mdSidenav = jasmine.createSpy().and.returnValue({ toggle: $mdSidenavToggle });

    vm = $controller('ToolbarController', {
      $scope: $rootScope.$new(),
      user: null,
      $mdSidenav: $mdSidenav
    });

    $timeout.flush();
  }));

  describe('init', function () {
    it('listens for user updates', function () {
      var user = { name: 'Foo', bio: 'Bar' };

      $rootScope.$broadcast(eventCode.USER_UPDATED, user);

      expect(vm.user).toEqual(user);
    });
  });

  describe('vm.initialLanguage', function () {
    beforeEach(function () {
      spyOn($translate, 'preferredLanguage').and.returnValue('tr');
    });

    it('looks up the language from cookie first', function () {
      spyOn($cookies, 'get').and.returnValue('en');

      expect(vm.initialLanguage()).toBe(vm.languages.en);
    });

    it('defaults to the preferred language otherwise', function () {
      spyOn($cookies, 'get').and.returnValue(undefined);

      expect(vm.initialLanguage()).toBe(vm.languages.tr);
    });
  });

  describe('vm.toggleSidenav', function () {
    it('toggles a sidenav', function () {
      var sidenavId = 'some-id';

      vm.toggleSidenav(sidenavId);

      expect($mdSidenav).toHaveBeenCalledWith(sidenavId);
      expect($mdSidenavToggle).toHaveBeenCalled();
    });
  });

  describe('vm.signOut', function () {
    beforeEach(function () {
      spyOn(Auth, 'signOut').and.callThrough();
      spyOn($state, 'go');
    });

    it('signs the user out', function (done) {
      vm.signOut().finally(function () {
        expect(Auth.signOut).toHaveBeenCalled();
        expect($state.go).toHaveBeenCalledWith('app.pages_auth_login');
        done();
      });

      $timeout.flush();
    });
  });

  describe('vm.changeLanguage', function () {
    var langOld;
    var langNew;

    beforeEach(function () {
      langOld = vm.languages['tr'];
      langNew = vm.languages['en'];

      $rootScope.loadingProgress = false;

      vm.selectedLanguage = langOld;

      spyOn(msUtils, 'toast');
      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn($cookies, 'put');
    });

    it('enables spinner after starting', function () {
      vm.changeLanguage(langNew);

      expect($rootScope.loadingProgress).toBe(true);
    });

    it('disables spinner when finished successfully', function (done) {
      vm.changeLanguage(langNew).then(function () {
        expect($rootScope.loadingProgress).toBe(false);
        done();
      });

      $timeout.flush();
    });

    it('disables spinner when finished unsuccessfully', function (done) {
      spyOn($translate, 'use').and.returnValue($q.reject());

      vm.changeLanguage(langNew).catch(function () {
        expect($rootScope.loadingProgress).toBe(false);
        done();
      });

      $timeout.flush();
    });

    it('updates the selected language', function (done) {
      vm.changeLanguage(langNew).finally(function () {
        expect(vm.selectedLanguage).toBe(langNew);
        done();
      });

      $timeout.flush();
    });

    it('broadcasts a language update event', function (done) {
      vm.changeLanguage(langNew).finally(function () {
        expect($rootScope.$broadcast).toHaveBeenCalledWith(eventCode.LANG_UPDATED, langNew.code);
        done();
      });

      $timeout.flush();
    });

    it('updates the language cookie', function (done) {
      vm.changeLanguage(langNew).finally(function () {
        expect($cookies.put).toHaveBeenCalledWith('lg', langNew.code);
        done();
      });

      $timeout.flush();
    });

    it('shows a message when successful', function (done) {
      vm.changeLanguage(langNew).finally(function () {
        expect(msUtils.toast).toHaveBeenCalledWith('TOOLBAR.LANGUAGE_UPDATED');
        done();
      });

      $timeout.flush();
    });

    it('shows a message when unsuccessful', function (done) {
      spyOn($translate, 'use').and.returnValue($q.reject());

      vm.changeLanguage(langNew).finally(function () {
        expect(msUtils.toast).toHaveBeenCalledWith('CORE.ERRORS.UNKNOWN');
        done();
      });

      $timeout.flush();
    });

    it('does not show a message when asked not to', function (done) {
      vm.changeLanguage(langNew, true).finally(function () {
        expect(msUtils.toast).not.toHaveBeenCalled();
        done();
      });

      $timeout.flush();
    });
  });

  describe('vm.toggleMsNavigationFolded', function () {
    beforeEach(function () {
      spyOn(msNavigationService, 'toggleFolded');
    });

    it('toggles navigation sidebar folded', function () {
      vm.toggleMsNavigationFolded();

      expect(msNavigationService.toggleFolded).toHaveBeenCalled();
    });
  });

  describe('vm.search', function () {
    var query;
    var states;

    beforeEach(function () {
      states = [{
        title: 'FAQ',
        translate: 'XYZ',
        keys: ['frequently', 'asked', 'questions'],
        uisref: 'app.about_faq',
        state: 'app.about_faq',
        stateParams: undefined,
        icon: 'icon-help-circle'
      },{
        title: 'CS 6250 Computer Networks',
        keys: [],
        uisref: 'app.reviews_course({ id: \'6250\' })',
        state: 'app.reviews_course',
        stateParams: { id: '6250' },
        icon: 'icon-server-network'
      },{
        title: 'CS 6505 Computability, Complexity & Algorithms',
        keys: [],
        uisref: 'app.grades_course({ id: \'6505\' })',
        state: 'app.grades_course',
        stateParams: { id: '6505' },
        icon: 'icon-keyboard-off'
      }];

      spyOn(msNavigationService, 'getFlatNavigation').and.returnValue(states);
    });

    it('returns empty array when there is no query', function (done) {
      query = null;

      vm.search(query).then(function (results) {
        expect(results.length).toEqual(0);
        done();
      });

      $timeout.flush();
    });

    it('returns empty array when there are no matching results', function (done) {
      query = 'asdf';

      vm.search(query).then(function (results) {
        expect(results.length).toEqual(0);
        done();
      });

      $timeout.flush();
    });

    it('finds results by title', function (done) {
      query = 'network';

      vm.search(query).then(function (results) {
        expect(results.length).toEqual(1);
        expect(results[0]).toEqual(states[1]);
        done();
      });

      $timeout.flush();
    });

    it('finds results by key', function (done) {
      query = 'quest';

      vm.search(query).then(function (results) {
        expect(results.length).toEqual(1);
        expect(results).toContain(states[0]);
        done();
      });

      $timeout.flush();
    });

    it('finds results by translation', function (done) {
      query = 'xy';

      vm.search(query).then(function (results) {
        expect(results.length).toEqual(1);
        expect(results).toContain(states[0]);
        done();
      });

      $timeout.flush();
    });

    it('appends reviews or grades to title where needed', function (done) {
      query = 'comp';

      vm.search(query).then(function (results) {
        expect(results.length).toEqual(2);
        expect(results).toContain(states[1]);
        expect(results).toContain(states[2]);
        expect(results[0].title).toContain(' (TOOLBAR.REVIEWS)');
        expect(results[1].title).toContain(' (TOOLBAR.GRADES)');
        done();
      });

      $timeout.flush();
    });
  });

  describe('vm.searchResultClick', function () {
    var item;

    beforeEach(function () {
      item = {
        title: 'Sample',
        uisref: 'app.sample',
        state: 'app.sample',
        stateParams: { foo: 'bar' },
        icon: 'icon-home'
      };

      spyOn($state, 'go');
    });

    it('changes state when uisref is available', function () {
      vm.searchResultClick(item);

      expect($state.go).toHaveBeenCalledWith(item.state, item.stateParams);
    });

    it('does not change state when there is no uisref', function () {
      item.uisref = null;
      vm.searchResultClick(item);

      expect($state.go).not.toHaveBeenCalled();
    });
  });
});
