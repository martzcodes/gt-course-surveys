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
                difficulty: 0,
                workload: 0
              };

              var counts = {
                total: 0,
                difficulty: 0,
                workload: 0
              };
              
              angular.forEach(reviewList, function (review) {
                counts.total++;

                if (review.difficulty > 0) {
                  totals.difficulty += review.difficulty;
                  counts.difficulty++;
                }

                if (review.workload > 0) {
                  totals.workload += review.workload;
                  counts.workload++;
                }
              });

              if (counts.total > 0) {
                course.reviewCount = counts.total;
              }
              if (counts.difficulty > 0) {
                course.averageDifficulty = totals.difficulty / counts.difficulty;
              }
              if (counts.workload > 0) {
                course.averageWorkload = totals.workload / counts.workload;
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