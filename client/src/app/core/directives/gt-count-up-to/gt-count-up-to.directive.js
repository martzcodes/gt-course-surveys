(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('gtCountUpTo', gtCountUpTo);

  /** @ngInject */
  function gtCountUpTo($timeout, CountUp, _) {
    var directive = {
      link: link,
      restrict: 'A',
      scope: {
        'countUpTo': '=gtCountUpTo',
        'options': '=gtOptions'
      }
    };
    return directive;

    function link($scope, $element, $attrs) {
      var options = {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: ''
      };

      if ($scope.options) {
        _.forEach(_.keys(options), function (option) {
          if (angular.isDefined($scope.options[option])) {
            options[option] = $scope.options[option];
          }
        });
      }

      $attrs.from = angular.isUndefined($attrs.from) ? 0 : parseInt($attrs.from);
      $attrs.decimals = angular.isUndefined($attrs.decimals) ? 2 : parseFloat($attrs.decimals);
      $attrs.duration = angular.isUndefined($attrs.duration) ? 4 : parseFloat($attrs.duration);

      var watcher = $scope.$watch('countUpTo', function () {
        $timeout(function () {
          var animation = new CountUp($element[0], $attrs.from, $scope.countUpTo, $attrs.decimals, $attrs.duration, options);
          animation.start();
        }, 500);
      });

      $scope.$on('$destroy', function () {
        watcher();
      });
    }
  }
})();
