(function () {
  'use strict';

  angular
    .module('app.main.chat.bot')
    .controller('ChatBotController', ChatBotController);

  /** @ngInject */
  function ChatBotController($timeout, $document, $mdDialog, Bot, Util, User, user) {
    const vm = this;

    // Data

    vm.working = false;
    vm.grow = false;
    vm.query = '';
    vm.thread = [];
    vm.user = user;

    // Methods

    vm.about = about;
    vm.clear = clear;
    vm.conversate = conversate;

    //////////

    init();

    async function init() {
      vm.user = await User.update(user, { token: null });
    }

    function about($event) {
      const html = [
        'I\'m a bot that can answer questions about courses.',
        'Start by asking me a question.',
        [
          'Some examples:',
          '"What\'s the hardest?"',
          '"How is the math in 6601?"',
          '"Which languages should I know for ML?"',
          '"Is there a lot of homework in KBAI?"',
          '"How is the professor in CCA?"'
        ].join('<br>')
      ].join('<br><br>');

      const dialog = $mdDialog.alert()
        .title('About')
        .htmlContent(html)
        .ok('OK')
        .targetEvent($event);

      $mdDialog.show(dialog);
    }

    function clear() {
      _reset();

      if (vm.thread.length) {
        vm.thread = [];
        Util.toast('Messages cleared!');
      } else {
        Util.toast('Nothing to clear!');
      }
    }

    async function conversate($event, fromClick) {
      if (!$event) {
        return;
      }
      $event.preventDefault();

      if ($event && $event.keyCode === 13 && $event.shiftKey) {
        vm.grow = true;
        return;
      }

      if ($event && $event.keyCode !== 13 && !fromClick) {
        return;
      }

      if (!vm.query) {
        _reset();
        return;
      }

      const query = vm.query;

      _reset();

      _log({ by: 'user', text: query });

      vm.working = true;
      try {
        _log({ by: 'bot', text: await Bot.conversate(query) });
      } catch (error) {
        Util.toast('Oops, I encountered an error! Please try again.');
      }
      vm.working = false;
    }

    function _reset() {
      vm.grow = false;
      vm.query = '';
    }

    function _log(message) {
      $timeout(() => {
        vm.thread.push(_.assign({}, message, { time: moment.utc().format() }));
        _scroll();
        _focus();
      });
    }

    function _scroll() {
      $timeout(() => {
        const content = angular.element($document.find('#gt-chat-content'));
        content.animate({ scrollTop: content[0].scrollHeight }, 400);
      });
    }

    function _focus() {
      $timeout(() => {
        angular.element('#gt-chat textarea').focus();
      });
    }
  }
})();
