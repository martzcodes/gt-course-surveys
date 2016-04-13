(function () {
    'use strict';

    angular
        .module('app')
        .config(translateConfig);

    /* @ngInject */
    function translateConfig($translateProvider, $translatePartialLoaderProvider, appLanguages) {
        /**
         *  each module loads its own translation file - making it easier to create translations
         *  also translations are not loaded when they aren't needed
         *  each module will have a il8n folder that will contain its translations
         */
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/il8n/{lang}.json'
        });

        $translatePartialLoaderProvider.addPart('app');

        // make sure all values used in translate are sanitized for security
        $translateProvider.useSanitizeValueStrategy('sanitize');

        // cache translation files to save load on server
        $translateProvider.useLoaderCache(true);

        // setup available languages in translate
        var languageKeys = [];
        for (var lang = appLanguages.length - 1; lang >= 0; lang--) {
            languageKeys.push(appLanguages[lang].key);
        }

        /**
         *  try to detect the users language by checking the following
         *      navigator.language
         *      navigator.browserLanguage
         *      navigator.systemLanguage
         *      navigator.userLanguage
         */
        $translateProvider
            .registerAvailableLanguageKeys(languageKeys, {
                'en_US': 'en',
                'en_UK': 'en'
            })
            .use('en');

        // store the users language preference in a cookie
        $translateProvider.useLocalStorage();
    }
})();
