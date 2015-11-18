angular.module('surveyor').factory('Grades',
  function (globals, $firebaseObject) {
    return function (courseId) {
      return $firebaseObject(globals.firebase.child('grades').child(courseId));
    };
  }
);