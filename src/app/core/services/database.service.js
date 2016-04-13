(function () {
    'use strict';

    angular
        .module('app.core.services')
        .factory('databaseService', databaseService);

    /* @ngInject */
    function databaseService(firebase, firebaseUrl) {
        return new firebase(firebaseUrl);
    }
})();
