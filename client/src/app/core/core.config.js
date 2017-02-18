(function () {
  'use strict';

  angular
    .module('app.core')
    .config(config);

  /** @ngInject */
  function config($ariaProvider, $logProvider, msScrollConfigProvider) {
    /* eslint-disable */
    $logProvider.debugEnabled(true);
    $ariaProvider.config({ tabindex: false });
    msScrollConfigProvider.config({ wheelPropagation: true });
    /* eslint-enable */
  }
})();
