angular.module('surveyor').controller('GradesController',
  function ($scope, CourseList, $location, Notification, Grades, $filter, globals) {
    $scope.loading = true;
    $scope.courses = CourseList();
    $scope.courses.$loaded()
      .then(function (courses) {
        angular.forEach(courses, function (course) {
          course.grades = Grades(course.$id);
          course.grades.$loaded()
            .then(function (grades) {
              $scope.loading = false;

              course.a = course.b = course.c = course.w = 0;
              
              if (grades.total > 0) {
                course.a = Number($filter('number')((grades.a * 100 / grades.total), 0));
                course.b = Number($filter('number')((grades.b * 100 / grades.total), 0));
                course.c = Number($filter('number')((grades.c * 100 / grades.total), 0));
                course.w = Number($filter('number')((grades.w * 100 / grades.total), 0));
              }
            });
        });
      });

    $scope.select = function (course) {
      $location.path('/course/' + course.$id);
    };

    gapi.plus.go('google-plus-grades');
  }
);