(function() {
  'use strict';

  angular
    .module('surveyor')
    .factory('slack', slack);

  slack.$inject = [
    '$http', '$location'
  ];

  /* @ngInject */
  function slack ($http, $location) {
    var service = {
      url: 'https://hooks.slack.com/services/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',
      messageTypes: {
        signUp: 'sign-up',
        signIn: 'sign-in',
        publishReview: 'publish-review'
      },
      postMessage: postMessage
    };
    return service;

    ////////////////

    function postMessage (options) {
      if ($location.host() === 'localhost') {
        return;
      }

      var text;
      switch (options.type) {
        case service.messageTypes.signUp:
          text = '```sign-up: ' + options.name + ', ' + options.email + ' (' + options.provider + ')```';
          break;
        case service.messageTypes.signIn:
          text = '```sign-in: ' + options.name + ', ' + options.email + ' (' + options.provider + ')```';
          break;
        case service.messageTypes.publishReview:
          text = '```publish: ' + options.name + ', ' + options.email + ' (' + options.course + ')```';
          break;
        default:
          return;
      }

      var payload = {
        channel: '#development',
        username: 'gt-course-surveys',
        icon_emoji: ':clipboard:',
        text: text
      };
      
      return $http({
        method: 'POST',
        url: service.url,
        data: payload,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
    }
  }
})();