(function () {
  'use strict';

  angular
    .module('app.main.chat.bot', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, msNavigationServiceProvider) {
    $stateProvider.state('app.main_chat_bot', {
      url: '/chat/bot',
      views: {
        'content@app': {
          templateUrl: 'app/main/chat/bot/bot.html',
          controller: 'ChatBotController as vm'
        }
      },
      resolve: {
        user: (Auth) => Auth.requireUser()
      },
      bodyClass: 'main-chat-bot'
    });

    msNavigationServiceProvider.saveItem('app_main_chat.bot', {
      title: 'Bot',
      icon: 'icon-message-text',
      state: 'app.main_chat_bot',
      weight: 2.1
    });
  }
})();
