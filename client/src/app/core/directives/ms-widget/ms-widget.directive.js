(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('MsWidgetController', MsWidgetController)
    .directive('msWidget', msWidgetDirective)
    .directive('msWidgetFront', msWidgetFrontDirective)
    .directive('msWidgetBack', msWidgetBackDirective);

  /** @ngInject */
  function MsWidgetController($scope, $element) {
    const vm = this;

    // Data
    vm.flipped = false;

    // Methods
    vm.flip = flip;

    //////////

    /**
     * Flip the widget
     */
    function flip() {
      if (!isFlippable()) {
        return;
      }

      // Toggle flipped status
      vm.flipped = !vm.flipped;

      // Toggle the 'flipped' class
      $element.toggleClass('flipped', vm.flipped);
    }

    /**
     * Check if widget is flippable
     *
     * @return {boolean}
     */
    function isFlippable() {
      return (angular.isDefined($scope.flippable) && $scope.flippable === true);
    }
  }

  /** @ngInject */
  function msWidgetDirective() {
    return {
      restrict: 'E',
      scope: {
        flippable: '=?'
      },
      controller: 'MsWidgetController',
      transclude: true,
      compile(tElement) {
        tElement.addClass('ms-widget');

        return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn) {
          // Custom transclusion
          transcludeFn((clone) => {
            iElement.empty();
            iElement.append(clone);
          });

          //////////
        };
      }
    };
  }

  /** @ngInject */
  function msWidgetFrontDirective() {
    return {
      restrict: 'E',
      require: '^msWidget',
      transclude: true,
      compile(tElement) {
        tElement.addClass('ms-widget-front');

        return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn) {
          // Custom transclusion
          transcludeFn((clone) => {
            iElement.empty();
            iElement.append(clone);
          });

          // Methods
          scope.flipWidget = MsWidgetCtrl.flip;
        };
      }
    };
  }

  /** @ngInject */
  function msWidgetBackDirective() {
    return {
      restrict: 'E',
      require: '^msWidget',
      transclude: true,
      compile(tElement) {
        tElement.addClass('ms-widget-back');

        return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn) {
          // Custom transclusion
          transcludeFn((clone) => {
            iElement.empty();
            iElement.append(clone);
          });

          // Methods
          scope.flipWidget = MsWidgetCtrl.flip;
        };
      }
    };
  }
})();
