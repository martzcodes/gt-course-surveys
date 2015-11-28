angular.module('surveyor').controller('SignUpController',
  function ($scope, $location, globals, Notification) {
    if (globals.firebase.getAuth()) {
      $location.path('/account');
      return;
    }

    $('input[type=email]').select();

    $scope.working = false;

    $scope.onUserCreated = function (error, authData) {
      $scope.working = false;
      if (error) {
        Notification.error(error);
      }
      else {
        globals.firebase.resetPassword({
          email: $scope.user.email
        }, function (error) {
          if (error) {
            Notification.error(error);
          }
          else {
            Notification.success('Account created. Check your email for login instructions.');
          }
        });
      }
    };

    $scope.generatePassword = function () {
      var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?_-';
      var password = '';
      for (var i = 0; i < 16; i++) {
        password += characters[Math.floor(Math.random() * characters.length)];
      }
      return password;
    };

    $scope.signUp = function (user) {
      if (!user.email) {
        Notification.error('Please enter a gatech.edu email.');
      }
      else {
        $scope.working = true;
        globals.firebase.createUser({
          email: user.email,
          password: $scope.generatePassword()
        }, $scope.onUserCreated);
      }
    };
  }
);