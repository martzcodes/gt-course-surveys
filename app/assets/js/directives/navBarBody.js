angular.module('surveyor').directive('navBarBody',
  function () {
    return {
      replace: true,
      restrict: 'E',
      templateUrl: 'assets/templates/directives/navBarBody.html',
      controller: function ($scope, globals, $location, Notification, User, $http) {
        $scope.user = $scope.user || {};
        $scope.userUnbind = null;

        $scope.notifySlack = function (authData, user, created) {
          if ($location.host() === 'localhost') {
            return;
          }

          var text = '```' + (created ? 'sign-up: ' : 'sign-in: ') + user.name + ', ' + user.email + ' (' + authData.provider + ')```';
          var payload = {
            channel: '#authentication',
            username: 'gt-course-surveys',
            icon_emoji: ':clipboard:',
            text: text
          };
          
          $http({
            method: 'POST',
            url: globals.slackUrl,
            data: payload,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          });
        };

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
                $scope.notifySlack(authData, user, true);
              }
              else {
                $scope.notifySlack(authData, user, false);
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