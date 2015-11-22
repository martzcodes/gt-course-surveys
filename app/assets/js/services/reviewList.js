angular.module('surveyor').factory('ReviewList',
  function (globals, $firebaseArray) {
    return function (id, isUserId) {
      if (!isUserId) {
        return $firebaseArray(globals.firebase.child('reviews').orderByChild('course').equalTo(id));
      }
      else {
        return $firebaseArray(globals.firebase.child('reviews').orderByChild('author').equalTo(id));
      }
    };
  }
);