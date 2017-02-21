(function () {
  'use strict';

  angular
    .module('app.main.chat', [
      'app.main.chat.bot'
    ])
    .config(config);

  /** @ngInject */
  function config(msNavigationServiceProvider) {
    msNavigationServiceProvider.saveItem('app_main_chat', {
      title: 'Chat',
      group: true,
      weight: 4
    });
  }
})();
