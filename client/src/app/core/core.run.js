(function () {
  'use strict';

  angular
    .module('app.core')
    .run(runBlock);

  /** @ngInject */
  function runBlock(fuseGenerator, fuseConfig, msUtils, bowser) {
    fuseGenerator.generate();

    if (fuseConfig.getConfig('disableMdInkRippleOnMobile') && msUtils.isMobile()) {
      angular.element('body').attr('md-no-ink', true);
    }

    if (msUtils.isMobile()) {
      angular.element('html').addClass('is-mobile');
    }

    angular.element('html').addClass(angular.lowercase(bowser.name) + ' ' + bowser.version);
  }
})();
