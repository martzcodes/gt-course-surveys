(function () {
  'use strict';

  angular
    .module('app.core')
    .provider('fuseConfig', fuseConfigProvider);

  /** @ngInject */
  function fuseConfigProvider() {
    var fuseConfiguration = {
      disableCustomScrollbars: false,
      disableMdInkRippleOnMobile: true,
      disableCustomScrollbarsOnMobile: true
    };

    //////////

    /**
     * Provides the service.
     *
     * @return {!fuseConfig}
     */
    this.$get = function () {
      var service = {
        getConfig: getConfig,
        setConfig: setConfig
      };

      return service;

      //////////

      /**
       * Gets a config value.
       *
       * @param {string} key
       * @return {boolean}
       */
      function getConfig(key) {
        return !!fuseConfiguration[key];
      }

      /**
       * Sets config value.
       *
       * @param {string} key
       * @param {boolean} value
       * @return {!fuseConfig}
       */
      function setConfig(key, value) {
        fuseConfiguration[key] = value;

        return this;
      }
    };
  }
})();
