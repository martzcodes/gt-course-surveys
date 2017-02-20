(function () {
  'use strict';

  angular
    .module('app')
    .constant('firebaseConfig', {
      apiKey: 'AIzaSyDJ4eSJ0d6qWSwz4J2SUWftOnP_qSg0Eco',
      authDomain: 'gt-surveyor.firebaseapp.com',
      databaseURL: 'https://gt-surveyor.firebaseio.com',
      storageBucket: 'firebase-gt-surveyor.appspot.com',
      messagingSenderId: '138094612706'
    })
    .constant('apiUrl', {
      server: 'https://gt-course-surveys-prd.herokuapp.com',
      bot: 'https://youngblksocrates.pythonanywhere.com/api/v1'
    })
    .constant('errorCode', {
      HTTP_401: 401,
      HTTP_404: 404,
      HTTP_500: 500
    })
    .constant('eventCode', {
      LANG_UPDATED: 1,
      USER_UPDATED: 2,
      REVIEW_CREATED: 3,
      REVIEW_UPDATED: 4,
      REVIEW_REMOVED: 5
    });
})();
