angular.module('surveyor').directive('review',
  function (globals, Notification, $window) {
    return {
      replace: true,
      restrict: 'E',
      templateUrl: '/assets/templates/directives/review.html',
      controller: function ($scope, User, globals) {
        $scope.author = User($scope.review.author);
        $scope.showTime = ($scope.review.author !== globals.anonymousUserId);
        $scope.showCancel = true;

        $scope.edit = function (review) {
          $scope.reviewBeforeEdits = {
            difficulty: review.difficulty,
            workload: review.workload,
            comments: review.comments
          };
          $scope.editing = true;
        };

        $scope.cancel = function () {
          $scope.review.difficulty = $scope.reviewBeforeEdits.difficulty;
          $scope.review.workload = $scope.reviewBeforeEdits.workload;
          $scope.review.comments = $scope.reviewBeforeEdits.comments;
          $scope.editing = false;
        };

        $scope.save = function (review) {
          review.updated = moment().format();
          $scope.course.reviews.$save(review)
            .then(function () {
              Notification.success('Saved.');
              $scope.editing = false;
            })
            .catch(Notification.error);
        };
      }
    };
  }
);