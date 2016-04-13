(function () {
    'use strict';

    angular
        .module('app')
        .config(layoutConfig);

    /* @ngInject */
    function layoutConfig(triLayoutProvider) {
        triLayoutProvider.setDefaultOption('toolbarSize', 'default');
        triLayoutProvider.setDefaultOption('toolbarShrink', false);
        triLayoutProvider.setDefaultOption('toolbarClass', '');
        triLayoutProvider.setDefaultOption('contentClass', '');
        triLayoutProvider.setDefaultOption('sideMenuSize', 'full');
        triLayoutProvider.setDefaultOption('showToolbar', true);
        triLayoutProvider.setDefaultOption('footer', false);
    }
})();
