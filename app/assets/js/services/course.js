angular.module('surveyor').factory('Course',
  function (globals, $firebaseObject) {
    return function (courseId) {
      return $firebaseObject(globals.firebase.child('courses').child(courseId));
    };
  }
);