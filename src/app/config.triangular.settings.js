(function () {
    'use strict';

    angular
        .module('app')
        .config(settingsConfig);

    /* @ngInject */
    function settingsConfig(triSettingsProvider, triRouteProvider, appLanguages) {
        var now = new Date();

        // set app name & logo (used in loader, sidemenu, footer, login pages, etc)
        triSettingsProvider.setName('GT Course Surveys');
        triSettingsProvider.setCopyright('&copy;&nbsp;' + now.getFullYear());
        triSettingsProvider.setLogo('assets/images/logo.png');

        // set current version of app (shown in footer)
        triSettingsProvider.setVersion('2.0.0');

        // set the document title that appears on the browser tab
        triRouteProvider.setTitle('GT Course Surveys');
        triRouteProvider.setSeparator('|');

        // setup available languages in triangular
        for (var lang = appLanguages.length - 1; lang >= 0; lang--) {
            triSettingsProvider.addLanguage({
                name: appLanguages[lang].name,
                key: appLanguages[lang].key
            });
        }
    }
})();
