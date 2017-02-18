(function () {
  'use strict';

  angular
    .module('app.core')
    .run(runBlock);

  /** @ngInject */
  async function runBlock($cookies, fuseGenerator, Api, Util) {
    fuseGenerator.generate();

    const serverVersion = await Api.post('version');
    const clientVersion = $cookies.get('vs');
    if (clientVersion !== serverVersion) {
      Util.outdated(serverVersion);
    }
  }
})();
