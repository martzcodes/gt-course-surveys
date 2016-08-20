(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('msSidenavHelper', msSidenavHelperDirective);

  /** @ngInject */
  function msSidenavHelperDirective() {
    return {
      restrict: 'A',
      require: '^mdSidenav',
      link: function (scope, iElement, iAttrs, MdSidenavCtrl) {
        // Watch md-sidenav open & locked open statuses
        // and add class to the ".page-layout" if only
        // the sidenav open and NOT locked open
        scope.$watch(function () {
          return MdSidenavCtrl.isOpen() && !MdSidenavCtrl.isLockedOpen();
        }, function (current) {
          if (angular.isUndefined(current)) {
            return;
          }

          iElement.parent()
            .toggleClass('full-height', current);
          angular.element('html')
            .toggleClass('sidenav-open', current);
        });
      }
    };
  }
})();
