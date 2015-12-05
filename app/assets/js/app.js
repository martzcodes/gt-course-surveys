angular.module('surveyor', [ 'ngRoute', 'firebase', 'ngAnimate', 'ui.gravatar', 'ui.bootstrap', 'toastr' ])
  .constant('globals', {
    firebase: new Firebase('https://gt-surveyor.firebaseio.com/'),
    unknownSemesterId: '0000-0',
    anonymousUserId: 'c36c1a3f-6655-4f31-b0a4-971fdc87fbe6'
  });