(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('msResponsiveTable', msResponsiveTableDirective);

  /** @ngInject */
  function msResponsiveTableDirective() {
    return {
      restrict: 'A',
      link(scope, iElement) {
        // Wrap the table
        const wrapper = angular.element('<div class="ms-responsive-table-wrapper"></div>');
        iElement.after(wrapper);
        wrapper.append(iElement);

        //////////
      }
    };
  }
})();
