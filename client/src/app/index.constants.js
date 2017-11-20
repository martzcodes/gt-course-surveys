(function () {
  'use strict';

  angular
    .module('app')
    .constant('gtConfig', {
      firebase: {
        apiKey: 'AIzaSyBEi34tJ32tvY_OZgTuwZmmSbwuCdqnqvM',
        authDomain: 'gt-course-surveys-dev.firebaseapp.com',
        databaseURL: 'https://gt-course-surveys-dev.firebaseio.com',
        storageBucket: 'gt-course-surveys-dev.appspot.com',
        messagingSenderId: '1029912675292'
      },
      url: {
        archive: 'https://gt-course-surveys-dev-archive.firebaseio.com',
        server: 'http://localhost:8000',
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
