angular.module('surveyor').factory('CourseList',
  function (globals, $firebaseArray) {
    return function () {
      return $firebaseArray(globals.firebase.child('courses'));
    };
  }
);