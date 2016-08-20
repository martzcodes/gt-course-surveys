(function () {
  'use strict';

  angular
    .module('app.toolbar')
    .controller('ToolbarController', ToolbarController);

  /** @ngInject */
  function ToolbarController(
      $scope,
      $rootScope,
      $q,
      $filter,
      $state,
      $timeout,
      $cookies,
      $mdSidenav,
      $translate,
      $mdToast,

      msNavigationService,
      msUtils,
      Auth,

      eventCode,
      user,
      _) {
    var vm = this;
    var translate = $filter('translate');

    // Data

    /**
     * Current user's data.
     *
     * @type {?User}
     */
    vm.user = user;

    /**
     * Available languages.
     *
     * @type {Map<LanguageCode, LanguageInfo>}
     */
    vm.languages = {
      en: {
        title: 'English',
        translation: 'TOOLBAR.ENGLISH',
        code: 'en',
        flag: 'us'
      },
      hi: {
        title: 'Hindi',
        translate: 'TOOLBAR.HINDI',
        code: 'hi',
        flag: 'in'
      },
      es: {
        title: 'Spanish',
        translation: 'TOOLBAR.SPANISH',
        code: 'es',
        flag: 'es'
      },
      de: {
        title: 'German',
        translation: 'TOOLBAR.GERMAN',
        code: 'de',
        flag: 'de'
      },
      fr: {
        title: 'French',
        translation: 'TOOLBAR.FRENCH',
        code: 'fr',
        flag: 'fr'
      },
      tr: {
        title: 'Turkish',
        translation: 'TOOLBAR.TURKISH',
        code: 'tr',
        flag: 'tr'
      }
    };

    // Methods

    vm.initialLanguage = initialLanguage;

    vm.toggleSidenav = toggleSidenav;
    vm.toggleMsNavigationFolded = toggleMsNavigationFolded;

    vm.signOut = signOut;
    vm.changeLanguage = changeLanguage;
    vm.search = search;
    vm.searchResultClick = searchResultClick;

    //////////

    init();

    function init() {
      vm.changeLanguage(vm.initialLanguage(), true);

      var userUpdateEvent = $scope.$on(eventCode.USER_UPDATED, function ($event, user) {
        vm.user = user;
      });

      $scope.$on('$destroy', function () {
        userUpdateEvent();
      });

      $timeout(function () {
        angular.element('#user-menu-content').removeClass('md-dense');
      });
    }

    /**
     * Determines the initial language.
     *
     * @return {object}
     */
    function initialLanguage() {
      return vm.languages[$cookies.get('lg') || $translate.preferredLanguage()];
    }

    /**
     * Toggles a sidenav.
     *
     * @param {string} sidenavId
     * @return {!Promise()}
     */
    function toggleSidenav(sidenavId) {
      return $mdSidenav(sidenavId).toggle();
    }

    /**
     * Signs user out.
     *
     * @return {!Promise()}
     */
    function signOut() {
      var deferred = $q.defer();

      Auth.signOut().then(function () {
        return $state.go('app.pages_auth_login');
      })
      .finally(deferred.resolve);

      return deferred.promise;
    }

    /**
     * Changes the language.
     *
     * @param {object} lang
     * @param {boolean=} noToast
     * @return {!Promise()}
     */
    function changeLanguage(lang, noToast) {
      var deferred = $q.defer();

      $rootScope.loadingProgress = true;

      $q.when($translate.use(lang.code))
      .then(function () {
        vm.selectedLanguage = lang;

        $rootScope.$broadcast(eventCode.LANG_UPDATED, lang.code);

        $cookies.put('lg', lang.code);

        if (!noToast) {
          msUtils.toast(translate('TOOLBAR.LANGUAGE_UPDATED'));
        }

        $rootScope.loadingProgress = false;

        deferred.resolve();
      })
      .catch(function () {
        $rootScope.loadingProgress = false;

        if (!noToast) {
          msUtils.toast(translate('CORE.ERRORS.UNKNOWN'));
        }

        deferred.reject();
      });

      return deferred.promise;
    }

    /**
     * Toggles navigation sidenav folded.
     */
    function toggleMsNavigationFolded() {
      msNavigationService.toggleFolded();
    }

    /**
     * Performs a search.
     *
     * @param {string} query
     * @return {!Promise(!Array<object>)}
     */
    function search(query) {
      if (!query || query.length < 1) {
        return $q.resolve([]);
      }

      var appends = {
        'app.reviews_course': ' (' + translate('TOOLBAR.REVIEWS') + ')',
        'app.grades_course':  ' (' + translate('TOOLBAR.GRADES')  + ')'
      };

      var results = _.chain(msNavigationService.getFlatNavigation())
        .filter('uisref')
        .map(function (item) {
          if (appends[item.state]) {
            item.title += appends[item.state];
          }
          return item;
        })
        .value();

      if (query) {
        query = _.toLower(query);

        results = _.filter(results, function (item) {
          var title = _.toLower(item.translate ? translate(item.translate) : item.title);

          return _.includes(title, query) ||
            _.includes(query, title) ||
            _.find(item.keys, function (key) {
              return _.includes(key, query) || _.includes(query, key);
            });
        });
      }

      return $q.resolve(results);
    }

    /**
     * Handles a search result click.
     *
     * @param {object} item
     */
    function searchResultClick(item) {
      if (item.uisref) {
        $state.go(item.state, item.stateParams);
      }
    }
  }
})();
