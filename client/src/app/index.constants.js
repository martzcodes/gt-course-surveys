(function () {
  'use strict';

  angular
    .module('app')

    .constant('firebaseConfig', {
      apiKey: 'AIzaSyBEi34tJ32tvY_OZgTuwZmmSbwuCdqnqvM',
      authDomain: 'gt-course-surveys-dev.firebaseapp.com',
      databaseURL: 'https://gt-course-surveys-dev.firebaseio.com',
      storageBucket: 'gt-course-surveys-dev.appspot.com'
    })
    .constant('apiUrl', 'http://localhost:5000')

    /* eslint-disable */
    /* jshint ignore:start */
    .constant('firebase', firebase)
    .constant('moment', moment)
    .constant('bowser', bowser)
    .constant('CountUp', CountUp)
    .constant('d3', d3)
    .constant('_', _)
    /* jshint ignore:end */
    /* eslint-enable */

    .constant('errorCode', {
      HTTP_404: 0,
      HTTP_500: 1,
      USER_REQUIRED: 2
    })

    .constant('eventCode', {
      LANG_UPDATED: 1,
      USER_UPDATED: 2,
      REVIEW_CREATED: 3,
      REVIEW_UPDATED: 4,
      REVIEW_REMOVED: 5
    });
})();
