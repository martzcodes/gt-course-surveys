(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('msSplashScreen', msSplashScreenDirective);

  /** @ngInject */
  function msSplashScreenDirective($animate) {
    return {
      restrict: 'E',
      link(scope, iElement) {
        var splashScreenRemoveEvent = scope.$on('msSplashScreen::remove', () => {
          $animate.leave(iElement).then(() => {
            // De-register scope event
            splashScreenRemoveEvent();

            // Null-ify everything else
            scope = iElement = null;
          });
        });
      }
    };
  }
})();
