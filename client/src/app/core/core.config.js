(function () {
  'use strict';

  angular
    .module('app.core')
    .config(config);

  /** @ngInject */
  function config(
      $ariaProvider,
      $logProvider,
      $translateProvider,
      $translatePartialLoaderProvider,
      msScrollConfigProvider,
      fuseConfigProvider) {
    $logProvider.debugEnabled(true);

    // angular-translate
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: '{part}/i18n/{lang}.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.useLoaderCache(true);

    // translate
    $translatePartialLoaderProvider.addPart('app/core');

    /* eslint-disable */

    // ng-aria
    $ariaProvider.config({
      tabindex: false
    });

    // fuse theme
    fuseConfigProvider.config({
      'disableCustomScrollbars': false,
      'disableCustomScrollbarsOnMobile': true,
      'disableMdInkRippleOnMobile': true
    });

    // msScroll
    msScrollConfigProvider.config({
      wheelPropagation: true
    });

    /* eslint-enable */
  }
})();
