(function () {
  'use strict';

  angular
    .module('app.core')
    .provider('fuseTheming', fuseThemingProvider);

  /** @ngInject */
  function fuseThemingProvider() {
    let $cookies;
    angular.injector(['ngCookies']).invoke(['$cookies', function (_$cookies_) {
      $cookies = _$cookies_;
    }]);

    let registeredPalettes;
    let registeredThemes;

    this.setRegisteredPalettes = setRegisteredPalettes;
    this.setRegisteredThemes = setRegisteredThemes;

    //////////

    function setRegisteredPalettes(_registeredPalettes) {
      registeredPalettes = _registeredPalettes;
    }

    function setRegisteredThemes(_registeredThemes) {
      registeredThemes = _registeredThemes;
    }

    this.$get = function () {
      const service = {
        getRegisteredPalettes,
        getRegisteredThemes,
        setActiveTheme,
        setThemesList,
        themes: {
          list: {},
          active: {
            name: '',
            theme: {}
          }
        }
      };

      return service;

      //////////

      function getRegisteredPalettes() {
        return registeredPalettes;
      }

      function getRegisteredThemes() {
        return registeredThemes;
      }

      function setActiveTheme(themeName) {
        if (angular.isUndefined(service.themes.list[themeName])) {
          themeName = 'default';
        }

        if (angular.isDefined(service.themes.list[themeName])) {
          service.themes.active.name = themeName;
          service.themes.active.theme = service.themes.list[themeName];
          $cookies.put('th', themeName);
        }
      }

      function setThemesList(themeList) {
        service.themes.list = themeList;
      }
    };
  }
})();
