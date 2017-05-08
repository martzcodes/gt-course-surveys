(function () {
  'use strict';

  angular
    .module('app.toolbar')
    .controller('ToolbarController', ToolbarController);

  /** @ngInject */
  function ToolbarController($rootScope, $scope, $state, $timeout, $mdSidenav, $mdToast, msNavigationService, Util, Auth, gtConfig, user) {
    const vm = this;

    // Data

    vm.user = user;

    // Methods

    vm.toggleSidenav = toggleSidenav;
    vm.toggleMsNavigationFolded = toggleMsNavigationFolded;

    vm.signOut = signOut;

    vm.search = search;
    vm.searchResultClick = searchResultClick;

    //////////

    init();

    function init() {
      const userUpdated = $scope.$on(gtConfig.code.event.USER_UPDATED, ($event, user) => {
        vm.user = user;
      });

      $scope.$on('$destroy', () => {
        userUpdated();
      });

      $timeout(() => {
        angular.element('#user-menu-content').removeClass('md-dense');
      });
    }

    function toggleSidenav(sidenavId) {
      return $mdSidenav(sidenavId).toggle();
    }

    async function signOut() {
      await Auth.signOut();
      await $state.go('app.main_pages_auth_login');
      vm.user = null;
    }

    function toggleMsNavigationFolded() {
      msNavigationService.toggleFolded();
    }

    function search(query) {
      if (!query || query.length < 1) {
        return [];
      }

      const appends = {
        'app.main_reviews_course': ' (Reviews)',
        'app.main_grades_course': ' (Grades)'
      };

      return _.chain(msNavigationService.getFlatNavigation())
        .filter('uisref')
        .map((item) => {
          if (appends[item.state]) {
            item.title += appends[item.state];
          }
          return item;
        })
        .filter((item) => {
          if (!query) {
            return true;
          }

          const queryL = _.toLower(query);
          const titleL = _.toLower(item.title);
          const keysL = _.map(item.keys, _.toLower);

          return _.includes(titleL, queryL) ||
            _.includes(queryL, titleL) ||
            _.some(keysL, (keyL) => _.includes(keyL, queryL) || _.includes(queryL, keyL));
        })
        .value();
    }

    function searchResultClick(item) {
      if (item.uisref) {
        $state.go(item.state, item.stateParams);
      }
    }
  }
})();
