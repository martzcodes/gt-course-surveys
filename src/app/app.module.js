(function () {
    'use strict';

    angular
        .module('app', [
            'ngAnimate',
            'ngCookies',
            'ngSanitize',
            'ngMessages',
            'ngMaterial',

            'ui.router',
            'pascalprecht.translate',
            'LocalStorageModule',
            'googlechart',
            'chart.js',
            'linkify',
            'ui.calendar',
            'angularMoment',
            'textAngular',
            'uiGmapgoogle-maps',
            'hljs',
            'md.data.table',
            angularDragula(angular),
            'ngFileUpload',

            'triangular',
            'firebase',

            'app.core',
            'app.components'
        ]);
})();
