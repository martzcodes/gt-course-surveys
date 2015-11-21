angular.module('surveyor').controller('GradesController',
  function ($scope, CourseList, $location, Notification, Grades, $filter, globals, $timeout) {
    $scope.loading = true;
    $scope.courses = CourseList();
    $scope.courses.$loaded()
      .then(function (courses) {
        angular.forEach(courses, function (course) {
          course.formattedNumber = course.number + (course.section ? '-' + course.section : '');
          course.grades = Grades(course.$id);
          course.grades.$loaded()
            .then(function (grades) {
              $scope.loading = false;

              course.grades = {
                '#': { a: 0, b: 0, c: 0, w: 0 },
                '%': { a: 0, b: 0, c: 0, w: 0 },
                total: 1
              };
              
              if (grades.total > 0) {
                course.grades.total = grades.total;
                course.grades['#'].a = Number(grades.a);
                course.grades['#'].b = Number(grades.b);
                course.grades['#'].c = Number(grades.c);
                course.grades['#'].w = Number(grades.w);
                course.grades['%'].a = Number($filter('number')((grades.a * 100 / grades.total), 0));
                course.grades['%'].b = Number($filter('number')((grades.b * 100 / grades.total), 0));
                course.grades['%'].c = Number($filter('number')((grades.c * 100 / grades.total), 0));
                course.grades['%'].w = Number($filter('number')((grades.w * 100 / grades.total), 0));
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

    $scope.displayMode = '%';
    $scope.toggleDisplay = function (displayMode) {
      $scope.displayMode = displayMode;
    };

    $scope.sortKey = function (course) {
      switch ($scope.sortType) {
        case 'a':
        case 'b':
        case 'c':
        case 'w': return course.grades[$scope.displayMode][$scope.sortType];
        case 'd': return course.department;
        case '#': return course.number;
        case 'n': return course.name;
        default : return 0;
      }
    };

    $scope.select = function (course) {
      $location.path('/course/' + course.$id);
    };

    $timeout(function () {
      gapi.plus.go('google-plus-grades');
    }, 1500);
  }
);