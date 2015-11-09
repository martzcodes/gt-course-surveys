angular.module('surveyor', [ 'ngRoute', 'ngResource', 'firebase', 'ngAnimate', 'ui.gravatar', 'ui.bootstrap', 'toastr', 'geolocation' ])
  .constant('globals', {
    firebase: new Firebase('https://gt-surveyor.firebaseio.com/'),
    anonymousUser: {
      email: 'anonymous-user@gatech.edu',
      password: 'anonymous'
    },
    unknownSemesterId: '0000-0'
  });