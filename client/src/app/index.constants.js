(function () {
  'use strict';

  angular
    .module('app')
    .constant('firebaseConfig', {
      apiKey: 'AIzaSyBEi34tJ32tvY_OZgTuwZmmSbwuCdqnqvM',
      authDomain: 'gt-course-surveys-dev.firebaseapp.com',
      databaseURL: 'https://gt-course-surveys-dev.firebaseio.com',
      storageBucket: 'gt-course-surveys-dev.appspot.com',
      messagingSenderId: '1029912675292'
    })
    .constant('apiUrl', {
      server: 'https://gt-course-surveys-dev.herokuapp.com',
      bot: 'https://youngblksocrates.pythonanywhere.com'
    })
    .constant('errorCode', {
      HTTP_401: 401,
      HTTP_404: 404,
      HTTP_500: 500
    })
    .constant('gtConfig', {
      LANG_UPDATED: 1,
      USER_UPDATED: 2,
      REVIEW_CREATED: 3,
      REVIEW_UPDATED: 4,
      REVIEW_REMOVED: 5
    });
})();
