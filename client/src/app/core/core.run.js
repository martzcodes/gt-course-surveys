(function () {
  'use strict';

  angular
    .module('app.core')
    .run(runBlock);

  /** @ngInject */
  function runBlock($cookies, fuseGenerator, Api, Util) {
    fuseGenerator.generate();

    // Api.post('VERSION').then((serverVersion) => {
    //   if (serverVersion) {
    //     const clientVersion = $cookies.get('vs');
    //     if (serverVersion !== clientVersion) {
    //       Util.outdated(serverVersion);
    //     }
    //   }
    // }).catch(_.noop);
  }
})();
