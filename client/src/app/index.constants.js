(function () {
  'use strict';

  angular
    .module('app')

    .constant('firebaseConfig', {
      apiKey: 'AIzaSyDJ4eSJ0d6qWSwz4J2SUWftOnP_qSg0Eco',
      authDomain: 'gt-surveyor.firebaseapp.com',
      databaseURL: 'https://gt-surveyor.firebaseio.com',
      storageBucket: 'firebase-gt-surveyor.appspot.com'
    })
    .constant('apiUrl', 'https://gt-course-surveys-prd.herokuapp.com')

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
