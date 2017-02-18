(function () {
  'use strict';

  angular
    .module('app.core')
    .provider('fuseConfig', fuseConfigProvider);

  /** @ngInject */
  function fuseConfigProvider() {
    const fuseConfiguration = {
      disableCustomScrollbars: false,
      disableMdInkRippleOnMobile: true,
      disableCustomScrollbarsOnMobile: true
    };

    //////////

    this.$get = function () {
      const service = {
        getConfig,
        setConfig
      };

      return service;

      //////////

      function getConfig(key) {
        return !!fuseConfiguration[key];
      }

      function setConfig(key, value) {
        fuseConfiguration[key] = value;
        return this;
      }
    };
  }
})();
