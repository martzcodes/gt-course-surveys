angular.module('surveyor').directive('navBarBody',
  function () {
    return {
      replace: true,
      restrict: 'E',
      templateUrl: 'assets/templates/directives/navBarBody.html',
      link: function ($scope, element, attrs, User) {

      },
      controller: function ($scope, globals, $location, $firebaseObject, Notification, User) {
        $scope.user = $scope.user || {};

        $scope.unbindUser = null;

        globals.firebase.onAuth(function (authData) {
          $scope.authData = authData;
          if (authData) {
            var user = User(authData.uid);

            user.$bindTo($scope, 'user').then(function (unbind) {
              $scope.unbindUser = unbind;
            });

            user.$loaded().then(function (user) {
              $scope.isAnonymous = ($scope.user.email === globals.anonymousUser.email);
              
              if (authData.provider === 'google' && !$scope.user.email) {
                globals.firebase.child('users').child(authData.uid).set({
                  email: authData.google.email,
                  name: authData.google.displayName
                });
              }
            });
          }
        });

        $scope.signOut = function () {
          globals.firebase.unauth();
          $scope.unbindUser();
          $scope.user = {};
          $location.path('/');
          Notification.success('Signed out.');
        };
      }
    };
  }
);