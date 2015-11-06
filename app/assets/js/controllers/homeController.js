angular.module('surveyor').controller('HomeController',
  function ($scope, CourseList, $window, $location, Notification, geolocation, ReviewList, $filter, globals) {
    $scope.courses = CourseList();
    $scope.courses.$loaded()
      .then(function (courses) {
        angular.forEach(courses, function (course) {
          course.reviews = ReviewList(course.$id);
          course.reviews.$loaded()
            .then(function (reviewList) {
              var totals = {
                count: 0,
                difficulty: 0,
                workload: 0
              };
              
              angular.forEach(reviewList, function (review) {
                totals.count++;
                totals.difficulty += review.difficulty;
                totals.workload += review.workload;
              });

              if (totals.count > 0) {
                course.reviewCount = totals.count;
                course.averageDifficulty = totals.difficulty / totals.count;
                course.averageWorkload = totals.workload / totals.count;
              }
            });
        });
      });

    $scope.select = function (course) {
      $location.path('/course/' + course.$id);
    };

    // if ($scope.authData && $scope.user && $scope.user.email !== globals.anonymousUser.email) {
    //   geolocation.getLocation()
    //     .then(function (geoPosition) {
    //       $scope.user.location = {
    //         latitude: geoPosition.coords.latitude,
    //         longitude: geoPosition.coords.longitude
    //       };
    //     });
    // }
  }
);