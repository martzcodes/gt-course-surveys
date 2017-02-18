(function () {
  'use strict';

  angular
    .module('app.core')
    .directive('gtSeasonBg', gtSeasonBg);

  /** @ngInject */
  function gtSeasonBg() {
    const month = _.toLower(moment().format('MMMM'));

    return {
      restrict: 'A',
      link($scope, $element) {
        $element.css('background-image', `url("/assets/images/backgrounds/${month}.jpg")`);
        $element.css('background-size', 'cover');
        $element.css('background-position', '0% 0%');
        $element.css('background-repeat', 'no-repeat');
      }
    };
  }
})();
