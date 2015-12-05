angular.module('surveyor').controller('WriteReviewController',
  function ($scope, globals, Notification, $location, slack) {
    if (!$scope.authData) {
      $location.path('/sign-in');
      return;
    }

    $scope.showCourse = true;
    $scope.showSemester = true;
    $scope.submitCaption = 'Publish';

    $scope.save = function (review) {
      var valid = true;

      if (!review.course) {
        Notification.error('Please select the course.');
        valid = false;
      }

      if (!review.semester) {
        Notification.error('Please select the semester.');
        valid = false;
      }
      
      if (!review.difficulty) {
        Notification.error('Please select a difficulty.');
        valid = false;
      }
      
      if (!review.workload) {
        Notification.error('Please enter a numeric workload.');
        valid = false;
      }
      
      if (!review.comments) {
        Notification.error('Please enter some comments.');
        valid = false;
      }

      if (valid) {
        globals.firebase.child('reviews').push({
          author: $scope.authData.uid,
          created: moment().format(),
          course: review.course.$id,
          semester: review.semester.$id,
          difficulty: review.difficulty,
          workload: review.workload,
          comments: review.comments
        }, function (error) {
          if (error) {
            Notification.error(error);
          }
          else {
            Notification.success('Review published.');
            $location.path('/course/' + review.course.$id);
            slack.postMessage({
              type: slack.messageTypes.publishReview,
              name: $scope.user.name,
              email: $scope.user.email,
              course: review.course.$id
            });
          }
        });
      }
    };
  }
);