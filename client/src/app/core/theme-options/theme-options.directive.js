(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('msThemeOptions', msThemeOptions);

  /** @ngInject */
  function msThemeOptions($mdSidenav) {
    return {
      restrict: 'E',
      scope: {},
      controller: 'MsThemeOptionsController as vm',
      templateUrl: 'app/core/theme-options/theme-options.html',
      compile: function ($element) {
        $element.addClass('ms-theme-options');

        return function postLink($scope) {
          function toggleOptionsSidenav() {
            $mdSidenav('fuse-theme-options').toggle();
          }

          $scope.toggleOptionsSidenav = toggleOptionsSidenav;
        };
      }
    };
  }
})();
