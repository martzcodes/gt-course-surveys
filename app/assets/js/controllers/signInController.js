angular.module('surveyor').controller('SignInController',
  function ($scope, $location, $routeParams, globals, Notification) {
    if (globals.firebase.getAuth()) {
      $location.path('/account');
    }

    $('input[type=email]').select();

    $scope.working = false;

    if ($routeParams.email) {
      $scope.user.email = $routeParams.email;
      $('input[type=password]').select();
    }

    $scope.onUserSignedIn = function (error, authData) {
      $scope.working = false;
      if (error) {
        if (error.code === 'TRANSPORT_UNAVAILABLE') {
          globals.firebase.authWithOAuthRedirect('google', $scope.onUserSignedIn);
        }
        else {
          Notification.error(error);
        }
      }
      else {
        Notification.success('Signed in.');
        $location.path('/');
      }
    };

    $scope.signIn = function (user) {
      if (!user.email || !user.password) {
        if (!user.password) {
          Notification.error('Please enter your password.');
        }
        if (!user.email) {
          Notification.error('Please enter your email.');
        }
      }
      else {
        $scope.working = true;
        globals.firebase.authWithPassword(user, $scope.onUserSignedIn);
      }
    };

    $scope.signInAnonymously = function () {
      $scope.working = true;
      globals.firebase.authWithPassword(globals.anonymousUser, $scope.onUserSignedIn);
    };

    $scope.signInGoogle = function () {
      $scope.working = true;
      globals.firebase.authWithOAuthPopup('google', $scope.onUserSignedIn, { scope: 'email' });
    };
  }
);