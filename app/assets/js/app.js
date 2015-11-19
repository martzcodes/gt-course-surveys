angular.module('surveyor', [ 'ngRoute', 'firebase', 'ngAnimate', 'ui.gravatar', 'ui.bootstrap', 'toastr' ])
  .constant('globals', {
    firebase: new Firebase('https://gt-surveyor.firebaseio.com/'),
    unknownSemesterId: '0000-0'
  });