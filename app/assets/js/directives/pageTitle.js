angular.module('surveyor').directive('pageTitle',
  function () {
    return {
      replace: true,
      restrict: 'E',
      scope: {
        title: '@',
        url: '@'
      },
      templateUrl: 'assets/templates/directives/pageTitle.html'
    };
  }
);