angular.module('surveyor').directive('navBarBody',
  function () {
    return {
      replace: true,
      restrict: 'E',
      templateUrl: 'assets/templates/directives/navBarBody.html',
      controller: function ($scope, globals, $location, Notification, User, slack) {
        $scope.user = $scope.user || {};
        $scope.userUnbind = null;

        globals.firebase.onAuth(function (authData) {
          $scope.authData = authData;
          if (authData) {
            var user = User(authData.uid);

            user.$bindTo($scope, 'user').then(function (unbind) {
              $scope.userUnbind = unbind;
            });

            user.$loaded().then(function (user) {
              // one time user creation
              if (!$scope.user.created) {
                $scope.user.created = moment().format();
                switch (authData.provider) {
                  case 'password':
                    $scope.user.email = authData.password.email;
                    $scope.user.name = authData.password.email.split('@')[0].replace(/\./g, ' ');
                    break;
                  case 'google':
                    $scope.user.email = authData.google.email;
                    $scope.user.name = authData.google.displayName;
                    break;
                  default:
                    break;
                }
                slack.postMessage({
                  type: slack.messageTypes.signUp,
                  name: $scope.user.name,
                  email: $scope.user.email,
                  provider: authData.provider
                });
              }
              else {
                slack.postMessage({
                  type: slack.messageTypes.signIn,
                  name: $scope.user.name,
                  email: $scope.user.email,
                  provider: authData.provider
                });
              }
            });
          }
        });

        $scope.signOut = function () {
          globals.firebase.unauth();
          $scope.userUnbind();
          $scope.user = {};
          $location.path('/reviews');
          Notification.success('Signed out.');
        };
      }
    };
  }
);