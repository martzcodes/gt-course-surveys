(function () {
  'use strict';

  angular
    .module('app.pages', [
      'app.pages.auth.forgot-password',
      'app.pages.auth.set-password',
      'app.pages.auth.login',
      'app.pages.auth.register',
      'app.pages.error-404',
      'app.pages.error-500'
    ]);
})();
