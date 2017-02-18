(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('gtCountUpTo', gtCountUpTo);

  /** @ngInject */
  function gtCountUpTo($timeout) {
    const directive = {
      link,
      restrict: 'A',
      scope: {
        countUpTo: '=gtCountUpTo'
      }
    };
    return directive;

    function link($scope, $element, $attrs) {
      const options = {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: ''
      };

      $attrs.from = angular.isDefined($attrs.from) ? parseInt($attrs.from) : 0;
      $attrs.decimals = angular.isDefined($attrs.decimals) ? parseInt($attrs.decimals) : 2;
      $attrs.duration = angular.isDefined($attrs.duration) ? parseFloat($attrs.duration) : 3;

      const watch = $scope.$watch('countUpTo', () => {
        $timeout(() => {
          const animation = new CountUp($element[0], $attrs.from, $scope.countUpTo, $attrs.decimals, $attrs.duration, options);
          animation.start();
        }, 100);
      });

      $scope.$on('$destroy', () => {
        watch();
      });
    }
  }
})();
