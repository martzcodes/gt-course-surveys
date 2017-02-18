(function () {
  'use strict';

  angular
    .module('app.main.pages.auth', [
      'app.main.pages.auth.login',
      'app.main.pages.auth.register',
      'app.main.pages.auth.set-password',
      'app.main.pages.auth.forgot-password'
    ]);
})();
