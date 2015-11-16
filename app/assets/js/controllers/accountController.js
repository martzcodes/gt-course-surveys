angular.module('surveyor').controller('AccountController',
  function ($scope, $location, globals, Notification) {
    if (!$scope.authData) {
      $location.path('/sign-in');
      return;
    }

    $('input[name=name]').select();

    $scope.specializations = [
      'Computational Perception & Robotics',
      'Computing Systems',
      'Interactive Intelligence',
      'Machine Learning'
    ];
    $scope.working = false;

    $scope.onPasswordChanged = function (error) {
      $scope.working = false;
      if (error) {
        Notification.error(error);
      }
      else {
        Notification.success('Password changed.');
      }
    };

    $scope.changePassword = function (email, newPassword, newPasswordConfirmation, oldPassword) {
      if (newPassword !== newPasswordConfirmation) {
        Notification.error('Passwords do not match.');
      }
      else if (!oldPassword) {
        Notification.error('Enter your current password.');
      }
      else {
        try {
          $scope.working = true;
          globals.firebase.changePassword({
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword
          }, $scope.onPasswordChanged);
        }
        catch (error) {
          Notification.error(error);
        }
      }
    };
  }
);