angular.module('surveyor').factory('SemesterList',
  function (globals, $firebaseArray) {
    return function () {
      return $firebaseArray(globals.firebase.child('semesters'));
    };
  }
);