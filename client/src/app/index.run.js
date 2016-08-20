(function () {
  'use strict';

  angular
    .module('app')
    .run(runBlock);

  /** @ngInject */
  function runBlock(
      $rootScope,
      $timeout,
      $log,
      $state,
      $stateParams,
      $mdDialog,
      $mdToast,
      msNavigationService,
      firebase,
      firebaseConfig,
      errorCode) {
    var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function () {
      $rootScope.loadingProgress = true;

      $mdDialog.cancel();
      $mdToast.hide();
    });

    var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function () {
      $timeout(function () {
        $rootScope.loadingProgress = false;
      });
    });

    var stateChangeErrorEvent = $rootScope.$on('$stateChangeError', function (event, to_, toParams, from_, fromParams, error) {
      switch (error) {
        case errorCode.USER_REQUIRED:
          $state.go('app.pages_auth_login');
          break;

        case errorCode.HTTP_404:
          $state.go('app.pages_errors_error-404');
          break;

        case errorCode.HTTP_500:
          $state.go('app.pages_errors_error-500');
          break;

        default:
          $log.error(error);
          break;
      }
    });

    $rootScope.state = $state;

    $rootScope.$on('$destroy', function () {
      stateChangeStartEvent();
      stateChangeSuccessEvent();
      stateChangeErrorEvent();
    });

    firebase.initializeApp(firebaseConfig);
  }
})();
