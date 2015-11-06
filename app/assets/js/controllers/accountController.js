angular.module('surveyor').controller('AccountController',
  function ($scope, $location) {
    if (!$scope.authData) {
      $location.path('/sign-in');
    }

    if (!$scope.isAnonymous) {
      $('input[name=name]').select();
    }
  }
);