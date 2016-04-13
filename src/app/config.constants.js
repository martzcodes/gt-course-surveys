(function () {
    'use strict';

    angular
        .module('app')
        .constant('_', _)
        .constant('$', jQuery)
        .constant('moment', moment)
        .constant('firebase', Firebase)
        .constant('firebaseUrl', 'https://gt-surveyor.firebaseio.com/')
        .constant('unknownSemesterId', '0000-0')
        .constant('importInstant', '2015-11-05T06:00:00+00:00')
        .constant('appLanguages', [{
            name: 'LANGUAGES.ENGLISH',
            key: 'en'
        }, {
            name: 'LANGUAGES.FRENCH',
            key: 'fr'
        }, {
            name: 'LANGUAGES.GERMAN',
            key: 'de'
        }, {
            name: 'LANGUAGES.ITALIAN',
            key: 'it'
        }, {
            name: 'LANGUAGES.SPANISH',
            key: 'es'
        }, {
            name: 'LANGUAGES.TURKISH',
            key: 'tr'
        }]);
})();
