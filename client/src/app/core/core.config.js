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

    const oneDay = 24 * 60 * 60 * 1000;
    angular.extend(CacheFactoryProvider.defaults, {
      maxAge: oneDay,
      cacheFlushInterval: oneDay,
      deleteOnExpire: 'passive',
      storageMode: 'localStorage'
    });
  }
})();
