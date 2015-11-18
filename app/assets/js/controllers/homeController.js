angular.module('surveyor').controller('HomeController',
  function ($scope, CourseList, $window, $location, Notification, ReviewList, $filter, globals) {
    $scope.loading = true;
    $scope.courses = CourseList();
    $scope.courses.$loaded()
      .then(function (courses) {
        angular.forEach(courses, function (course) {
          course.reviews = ReviewList(course.$id);
          course.reviews.$loaded()
            .then(function (reviewList) {
              $scope.loading = false;
              
              var totals = { difficulty: 0, workload: 0 };
              var counts = { difficulty: 0, workload: 0, total: 0 };

              course.reviewCount = course.averageDifficulty = course.averageWorkload = 0;

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

              course.reviewCount = counts.total;
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
  }
);