angular.module('surveyor').controller('MyReviewsController',
  function ($scope, $routeParams, $window, Course, ReviewList, Notification) {
    if (!$scope.authData) {
      $location.path('/reviews');
      return;
    }

    $scope.reviews = ReviewList($scope.authData.uid, true);
    $scope.reviews.$loaded().catch(Notification.error);

    $scope.remove = function (review) {
      if ($window.confirm('Permanently delete this review?')) {
        $scope.reviews.$remove(review)
          .then(function () {
            Notification.success('Deleted.');
          })
          .catch(Notification.error);
      }
    };
  }
);