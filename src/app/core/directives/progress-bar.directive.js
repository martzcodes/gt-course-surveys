(function () {
    'use strict';

    angular
        .module('app.core.directives')
        .directive('progressBar', progressBar);

    /* @ngInject */
    function progressBar() {
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                value: '=',
                max: '@'
            },
            template: '<div class="progress" ng-if="value > 0">' +
                          '<div class="progress-bar" ng-style="{width: percent}" role="progressbar">' +
                              '<span>{{ value }}</span>' +
                          '</div>' +
                      '</div>'
        };
        return directive;

        function link($scope) {
            $scope.percent = Math.round(($scope.value * 100) / ($scope.max)) + '%';
        }
    }
})();
