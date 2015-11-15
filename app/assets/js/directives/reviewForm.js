angular.module('surveyor').directive('reviewForm',
  function () {
    return {
      replace: true,
      restrict: 'E',
      templateUrl: 'assets/templates/directives/reviewForm.html',
      controller: function ($scope, CourseList, SemesterList, Notification) {
        $scope.review = $scope.review || {};
        
        if ($scope.showCourse) {
          $scope.courses = CourseList();
          $scope.courses.$loaded().catch(Notification.error);
        }

        if ($scope.showSemester) {
          $scope.semesters = SemesterList();
          $scope.semesters.$loaded().catch(Notification.error);
        }

        $scope.selectCourse = function (course) {
          $scope.review.course = course;
        };

        $scope.selectSemester = function (semester) {
          $scope.review.semester = semester;
        };
      }
    };
  }
);