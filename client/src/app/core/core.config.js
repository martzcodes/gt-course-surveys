(function () {
  'use strict';

  angular
    .module('app.core')
    .config(config);

  /** @ngInject */
  function config($ariaProvider, $logProvider, msScrollConfigProvider, CacheFactoryProvider) {
    $logProvider.debugEnabled(true);

    $ariaProvider.config({ tabindex: false });

    msScrollConfigProvider.config({ wheelPropagation: true });

    angular.extend(CacheFactoryProvider.defaults, {
      maxAge: 24 * 60 * 60 * 1000,
      cacheFlushInterval: 24 * 60 * 60 * 1000,
      deleteOnExpire: 'passive',
      storageMode: 'localStorage'
    });
  }
})();
