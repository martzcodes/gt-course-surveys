angular.module('surveyor').controller('PasswordController',
  function ($scope, $location, globals, Notification) {
    if (globals.firebase.getAuth()) {
      $location.path('/account');
    }

    $('input[type=email]').select();

    $scope.working = false;

    $scope.onPasswordReset = function (error) {
      $scope.working = false;
      if (error) {
        Notification.error(error);
      }
      else {
        Notification.success('Temporary password sent.');
      }
    };

    $scope.sendPassword = function (user) {
      if (!user || !user.email) {
        Notification.error('Please enter your email.');
      }
      else {
        $scope.working = true;
        globals.firebase.resetPassword(user, $scope.onPasswordReset);
      }
    };
  }
);