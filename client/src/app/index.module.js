(function () {
  'use strict';

  angular
    .module('app', [
      'app.core',

      'app.navigation',
      'app.toolbar',
      'app.quick-panel',

      'app.pages',
      'app.account',
      'app.reviews',
      'app.grades',
      'app.about'
    ]);
})();
