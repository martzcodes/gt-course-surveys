angular.module('surveyor').controller('SignUpController',
  function ($scope, $location, globals, Notification) {
    if (globals.firebase.getAuth()) {
      $location.path('/account');
      return;
    }

    $('input[type=email]').select();

    $scope.working = false;

    $scope.onUserSignedIn = function (error, authData) {
      $scope.working = false;
      if (error) {
        Notification.error(error);
      }
      else {
        Notification.success('Signed in.');
        $location.path('/account');
      }
    };

    $scope.onUserCreated = function (error, authData) {
      if (error) {
        Notification.error(error);
        $scope.working = false;
      }
      else {
        Notification.success('Account created.');
        globals.firebase.authWithPassword($scope.user, $scope.onUserSignedIn);
      }
    };

    $scope.signUp = function (user) {
      if (!user.email || !user.password) {
        if (!user.password) {
          Notification.error('Please enter a password.');
        }
        if (!user.email) {
          Notification.error('Please enter a gatech.edu email.');
        }
      }
      else {
        $scope.working = true;
        globals.firebase.createUser(user, $scope.onUserCreated);
      }
    };
  }
);