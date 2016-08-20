(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('msInfoBar', msInfoBarDirective);

  /** @ngInject */
  function msInfoBarDirective() {
    return {
      restrict: 'E',
      scope: {},
      transclude: true,
      templateUrl: 'app/core/directives/ms-info-bar/ms-info-bar.html',
      link: function (scope, iElement) {
        var body = angular.element('body'),
            bodyClass = 'ms-info-bar-active';

        body.addClass(bodyClass);

        /**
         * Removes the element from the DOM.
         */
        function removeInfoBar() {
          body.removeClass(bodyClass);

          iElement.remove();

          scope.$destroy();
        }

        scope.removeInfoBar = removeInfoBar;
      }
    };
  }
})();
