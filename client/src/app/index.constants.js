(function () {
  'use strict';

  angular
    .module('app')
    .constant('gtConfig', {
      firebase: {
        apiKey: 'AIzaSyDJ4eSJ0d6qWSwz4J2SUWftOnP_qSg0Eco',
        authDomain: 'gt-surveyor.firebaseapp.com',
        databaseURL: 'https://gt-surveyor.firebaseio.com',
        storageBucket: 'firebase-gt-surveyor.appspot.com',
        messagingSenderId: '138094612706'
      },
      url: {
        archive: 'https://gt-course-surveys-prd-archive.firebaseio.com',
        server: 'https://gt-course-surveys-prd.herokuapp.com',
        bot: 'https://youngblksocrates.pythonanywhere.com'
      },
      code: {
        error: {
          HTTP_401: 401,
          HTTP_404: 404,
          HTTP_500: 500
        },
        event: {
          USER_UPDATED: 2,
          REVIEW_CREATED: 3,
          REVIEW_UPDATED: 4,
          REVIEW_REMOVED: 5
        }
      }
    });
})();
