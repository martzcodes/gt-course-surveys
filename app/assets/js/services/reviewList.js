angular.module('surveyor').factory('ReviewList',
  function (globals, $firebaseArray) {
    return function (courseId) {
      return $firebaseArray(globals.firebase.child('reviews').orderByChild('course').equalTo(courseId));
    };
  }
);