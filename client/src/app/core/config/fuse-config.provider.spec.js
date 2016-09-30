'use strict';

describe('provider: fuseConfig', function () {
  var fuseConfig;

  beforeEach(module('app'));

  beforeEach(inject(function ($injector) {
    fuseConfig = $injector.get('fuseConfig');
  }));

  describe('defaults', function () {
    it('enables custom scrollbars', function () {
      expect(fuseConfig.getConfig('disableCustomScrollbars')).toBe(false);
    });

    it('disables in ripple on mobile', function () {
      expect(fuseConfig.getConfig('disableMdInkRippleOnMobile')).toBe(true);
    });

    it('disables custom scrollbars on mobile', function () {
      expect(fuseConfig.getConfig('disableCustomScrollbarsOnMobile')).toBe(true);
    });
  });

  it('allows setting a config value', function () {
    fuseConfig.setConfig('disableCustomScrollbars', null);

    expect(fuseConfig.getConfig('disableCustomScrollbars')).toBe(false);
  });
});
