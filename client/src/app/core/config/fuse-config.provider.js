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

    // Methods
    this.config = config;

    //////////

    /**
     * Extends default configuration with the given one.
     *
     * @param {object} configuration
     */
    function config(configuration) {
      fuseConfiguration = angular.extend({}, fuseConfiguration, configuration);
    }

    /**
     * Provides the service.
     *
     * @return {!Service}
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
       * @return {!Service}
       */
      function setConfig(key, value) {
        fuseConfiguration[key] = value;

        return this;
      }
    };
  }
})();
