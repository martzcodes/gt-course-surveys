(function () {
    'use strict';

    angular
        .module('app.core.services')
        .factory('authService', authService);

    /* @ngInject */
    function authService($firebaseAuth, databaseService) {
        return $firebaseAuth(databaseService);
    }
})();
