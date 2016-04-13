(function () {
    'use strict';

    angular
        .module('app.core.services')
        .factory('slackService', slackService);

    /* @ngInject */
    function slackService($location, $http, $log) {
        var service = {
            url: 'https://hooks.slack.com/services/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',
            postNotification: postNotification
        };
        return service;

        ////////////////

        function postNotification(text) {
            var payload = {
                channel: '#gt-course-surveys',
                username: 'gt-course-surveys',
                text: '```' + text + '```'
            };

            if ($location.host() !== 'localhost') {
                $http({
                    method: 'POST',
                    url: this.url,
                    data: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            } else {
                $log.log('slack notification:', payload);
            }
        }
    }
})();
