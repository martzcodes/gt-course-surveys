(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('msCard', msCardDirective);

  /** @ngInject */
  function msCardDirective() {
    return {
      restrict: 'E',
      scope: {
        templatePath: '=template',
        card: '=ngModel',
        vm: '=viewModel'
      },
      template: '<div class="ms-card-content-wrapper" ng-include="templatePath" onload="cardTemplateLoaded()"></div>',
      compile: function (tElement) {
        tElement.addClass('ms-card');

        return function postLink(scope, iElement) {
          // Methods
          scope.cardTemplateLoaded = cardTemplateLoaded;

          //////////

          /**
           * Emits the cardTemplateLoaded event.
           */
          function cardTemplateLoaded() {
            scope.$emit('msCard::cardTemplateLoaded', iElement);
          }
        };
      }
    };
  }
})();
