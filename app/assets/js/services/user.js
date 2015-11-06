angular.module('surveyor').factory('User',
  function (globals, $firebaseObject) {
    return function (userId) {
      return $firebaseObject(globals.firebase.child('users').child(userId));
    };
  }
);