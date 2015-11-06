angular.module('surveyor').directive('review',
  function (globals, Notification, $window) {
    return {
      replace: true,
      restrict: 'E',
      templateUrl: '/assets/templates/directives/review.html',
      controller: function ($scope, $filter, User) {
        User($scope.review.author).$bindTo($scope, 'author');

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

        $scope.voteInternal = function (review, voterId, up) {
          if (up) {
            review.votes++;
          }
          else {
            review.votes--;
          }

          review.voters = review.voters || {};
          review.voters[voterId] = true;
          
          $scope.course.reviews.$save(review);
        };

        $scope.votedOnBy = function (review, voterId) {
          return review.voters && review.voters[voterId];
        };

        $scope.vote = function (review, up) {
          if ($scope.authData) {
            if ($scope.authData.uid === review.author) {
              Notification.info('Cannot vote on your reviews.');
            }
            else if ($scope.votedOnBy(review, $scope.authData.uid)) {
              Notification.info('You already voted.');
            }
            else {
              $scope.voteInternal(review, $scope.authData.uid, up);
            }
          }
          else {
            Notification.info('Please sign in first.');
          }
        };
      }
    };
  }
);