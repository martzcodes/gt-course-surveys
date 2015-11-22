angular.module('surveyor').controller('ReviewsController',
  function ($scope, CourseList, $window, $location, Notification, ReviewList, $filter, globals, $timeout) {
    $scope.loading = true;
    $scope.courses = CourseList();
    $scope.courses.$loaded()
      .then(function (courses) {
        angular.forEach(courses, function (course) {
          course.formattedNumber = course.number + (course.section ? '-' + course.section : '');
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
                course.averageDifficulty = Number($filter('number')(totals.difficulty / counts.difficulty, 1));
              }
              if (counts.workload > 0) {
                course.averageWorkload = Number($filter('number')(totals.workload / counts.workload, 1));
              }
            });
        });
      });

    $scope.sortType = null;
    $scope.sortReverse = null;
    $scope.toggleSort = function (sortType) {
      if ($scope.sortReverse === null) {
        $scope.sortReverse = true;
      }
      else if ($scope.sortType === sortType) {
        $scope.sortReverse = !$scope.sortReverse;
      }
      $scope.sortType = sortType;
    };
    
    $scope.select = function (course) {
      $location.path('/course/' + course.$id);
    };

    $timeout(function () {
      gapi.plus.go('google-plus-grades');
    }, 1500);
  }
);